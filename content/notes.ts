import type { Lang } from '@/lib/i18n';

/**
 * Technical notes. Every figure comes from Anomaly_LineScan/docs
 * (few_shot_industrial_research.md, DEPLOYMENT_BENCHMARKS.md#mobilenet-neighbors).
 */

export interface NoteSection {
  h: string;
  p?: string[];
  list?: string[];
  table?: { caption: string; head: string[]; rows: string[][] };
  /** Draw the table rows as range boxes against the gate. */
  chart?: { caption: string; x: string; y: string; gate: string; budget: string };
}

export interface Note {
  slug: string;
  date: string;
  title: string;
  lede: string;
  sections: NoteSection[];
}

// TP/26 and FP/107, range across seeds 39–46: [10 GOOD TP, 10 GOOD FP, 15 GOOD TP, 15 GOOD FP]
const results = [
  ['25–25', '5–13', '25–25', '4–11'],
  ['24–25', '4–12', '23–25', '4–11'],
  ['25–25', '5–13', '25–25', '4–11'],
  ['25–25', '6–19', '21–25', '6–12'],
  ['25–25', '6–45', '24–25', '6–34'],
  ['21–25', '4–9', '23–25', '6–8'],
  ['21–25', '5–9', '22–25', '6–10'],
  ['25–25', '5–22', '24–25', '4–11'],
  ['0–24', '0–5', '4–24', '0–5'],
  ['0–24', '0–5', '1–23', '0–5'],
];
const rows = (labels: string[]) => labels.map((l, i) => [l, ...results[i]]);

const en: Note = {
  slug: 'few-shot',
  date: '2026-09',
  title: 'Ten good images are enough for the model, not for the threshold',
  lede: 'A few-shot study on line-scan fabric inspection: 8 seeds, 160 operating points, and why none of them passed.',
  sections: [
    {
      h: 'The question',
      p: [
        'The deployed detector builds its memory bank from 10 good images and sets its thresholds on 50 more. On a 133-image test set (26 defective, 107 good) it catches 24 of 26 defects with 3 false alarms.',
        'Setting up a new product would be much easier if 10 or 15 good images in total were enough, for both the bank and the threshold. This note records what happened when I tried.',
      ],
    },
    {
      h: 'Protocol, fixed before scoring',
      list: [
        'Data: the Rollo7A roll of the public RAW-FABRID dataset (CC BY 4.0), with the same 133 test images.',
        'Model: MobileNetV3 pretrained on ImageNet, no fine-tuning. Features from blocks 4 and 6, 448 px tiles, 512 patches per image in the bank.',
        'Budgets: 10 or 15 good images. Eight seeds (39–46) decide which images. The 10-image set is the start of the 15-image set, so the budgets are nested, not independent.',
        'Threshold: leave-one-out on the same good images (each one is scored by a bank built without it), then median + 3 × 1.4826 × MAD. No defect image is used to fit anything.',
        'Gate: at least 25/26 defects and at most 3/107 false alarms.',
        '10 scoring or calibration variants × 2 budgets × 8 seeds = 160 operating points. They share one roll and one test set, so they are not 160 independent checks.',
      ],
    },
    {
      h: 'Results',
      chart: {
        caption: 'Each box spans 8 seeds for one variant and one budget (20 boxes, 160 operating points). The green corner is the gate. No box reaches it. Hover a box for its numbers.',
        x: 'False alarms (out of 107 good images)',
        y: 'Defects caught (out of 26)',
        gate: 'Gate: ≥ 25 caught, ≤ 3 false alarms',
        budget: '{n} good images',
      },
      table: {
        caption: 'Range across 8 seeds. TP out of 26 defective images, FP out of 107 good images.',
        head: ['Variant', 'TP, 10 good', 'FP, 10 good', 'TP, 15 good', 'FP, 15 good'],
        rows: rows([
          'Baseline: distance to nearest neighbour',
          'Mean of 3 nearest',
          'Neighbourhood reweighting (PatchCore-style)',
          'Distance ÷ local radius',
          'Distance − local radius',
          'Context halo 32 px',
          'Context halo 64 px',
          'Cross-fit threshold, MAD',
          'Cross-fit threshold, q95 × 1.10',
          'Cross-fit threshold, max × 1.10',
        ]),
      },
      p: [
        'No operating point passed. The rules with few false alarms got there by raising the threshold until most defects were missed, not by separating good from bad better.',
      ],
    },
    {
      h: 'Is it the threshold or the score?',
      p: [
        'To find out, I cheated on purpose and picked the threshold with the test labels. Even then, keeping 25 defects cost at least 4–5 false alarms for the baseline and 4–7 for the other scores. So the problem is how the score ranks images, not only where the line is drawn.',
        'Four good images (145, 179, 183 and 218) were flagged in all 8 seeds at both budgets. They contain local structures and horizontal texture bands that the features treat like defects. I kept their labels: looking similar to a defect is not proof that a label is wrong.',
      ],
    },
    {
      h: 'What else did not work',
      list: [
        'Choosing good images spread across the whole roll instead of from its start: median false alarms 8 against 8.5 on a new 83-image holdout, and none of the 32 banks reached the ≤ 2/83 target.',
        'Subtracting a per-row background from the score: still 25 defects caught, still 4–13 false alarms.',
        'Keeping all 11,760 patches per image, a bank 23 times larger: false alarms moved by −3, +1 and 0 on three seeds, while P95 latency rose from about 30 ms to 272 ms on an RTX A4000.',
        'Ensembles of 9 sub-banks, and comparing each patch with distant regions of the same image: no point passed.',
      ],
    },
    {
      h: 'The bottleneck is the threshold',
      p: [
        'Running the deployed pipeline with only its own 10 bank images for calibration showed why. In leave-one-out, nine of the ten good images scored between 11 and 22. One scored 38.2. A max rule follows that single image: 7/26 defects caught, 0 false alarms. Using the second-highest score instead gives 22/26 with 3/107, close but still below the deployed 24/26.',
        'Adding 5 more images (15 in total) did not change a single image-level decision. Augmenting the good images (brightness, gamma, row bands, shifts) raised their scores 1.05–1.25 times but kept the same order, so it cannot replace independent good images.',
        'Ten good images are enough to build the bank. They are not enough to set the threshold.',
      ],
    },
    {
      h: 'A lead, with its caveat',
      p: [
        'A later probe added a DINOv2 branch next to PatchCore and flagged an image only when both branches exceeded k times their median leave-one-out score. Against a looser target set for the product (at least 22/26, at most 5/107) it passed on 17 of 17 random sets of 5–20 good images.',
        'But the two k values were picked from a 36-cell grid on that same test set. Choosing on one half of the test and checking on the other half (300 random splits) brought the pass rate down to 42%. It is a lead to test on a new roll, not a result.',
      ],
    },
    {
      h: 'What I take from it',
      list: [
        'With 10 good images the deployed score still ranked images at an AUROC of 0.95, yet no threshold rule fixed in advance passed. For a production line, report counts at a fixed threshold, not only AUROC.',
        '3/107 does not prove a false-alarm rate below 3%. Even 0/107 only bounds it at about 2.8% (one-sided 95%). That needs hundreds to thousands of independent good images.',
        'Fix the protocol before looking at results, and stop tuning on a test set that has already been seen many times.',
        'Write down negative results so the next attempt does not repeat them.',
      ],
    },
    {
      h: 'Limits',
      p: [
        'All of this is development work on one roll and one test set that was reused many times. It does not show that few-shot methods fail in general, only that these configurations did not pass on this data.',
      ],
    },
  ],
};

const vi: Note = {
  slug: 'few-shot',
  date: '2026-09',
  title: 'Mười ảnh đạt chuẩn đủ cho mô hình, chưa đủ cho ngưỡng',
  lede: 'Một nghiên cứu few-shot cho kiểm tra vải bằng camera line-scan: 8 seed, 160 điểm vận hành, và vì sao không điểm nào đạt.',
  sections: [
    {
      h: 'Câu hỏi',
      p: [
        'Bộ phát hiện đang triển khai dựng memory bank từ 10 ảnh đạt chuẩn và đặt ngưỡng trên 50 ảnh khác. Trên tập test 133 ảnh (26 lỗi, 107 đạt chuẩn), nó bắt được 24/26 lỗi và báo nhầm 3 ảnh.',
        'Việc thiết lập sản phẩm mới sẽ dễ hơn nhiều nếu chỉ cần tổng cộng 10 hoặc 15 ảnh đạt chuẩn cho cả bank lẫn ngưỡng. Bài này ghi lại những gì xảy ra khi mình thử.',
      ],
    },
    {
      h: 'Quy trình, khóa trước khi chấm',
      list: [
        'Dữ liệu: cuộn Rollo7A trong bộ dữ liệu công khai RAW-FABRID (CC BY 4.0), cùng 133 ảnh test.',
        'Mô hình: MobileNetV3 pretrained trên ImageNet, không fine-tune. Đặc trưng từ blocks 4 và 6, tile 448 px, mỗi ảnh đóng góp 512 patch vào bank.',
        'Ngân sách: 10 hoặc 15 ảnh đạt chuẩn. Tám seed (39–46) quyết định chọn ảnh nào. Bộ 10 ảnh là phần đầu của bộ 15 ảnh, nên hai ngân sách lồng nhau, không độc lập.',
        'Ngưỡng: leave-one-out trên chính các ảnh đạt chuẩn đó (mỗi ảnh được chấm bằng bank không chứa nó), rồi lấy median + 3 × 1,4826 × MAD. Không dùng ảnh lỗi để fit bất cứ thứ gì.',
        'Mục tiêu: bắt ít nhất 25/26 lỗi và báo nhầm tối đa 3/107.',
        '10 biến thể chấm điểm hoặc hiệu chỉnh × 2 ngân sách × 8 seed = 160 điểm vận hành. Chúng dùng chung một cuộn và một tập test, nên không phải 160 lần kiểm chứng độc lập.',
      ],
    },
    {
      h: 'Kết quả',
      chart: {
        caption: 'Mỗi hình chữ nhật bao trọn 8 seed của một biến thể ở một ngân sách (20 hình, 160 điểm vận hành). Góc xanh là cổng đạt. Không hình nào chạm tới. Rê chuột lên hình để xem số.',
        x: 'Báo nhầm (trên 107 ảnh tốt)',
        y: 'Lỗi bắt được (trên 26)',
        gate: 'Cổng đạt: bắt ≥ 25, báo nhầm ≤ 3',
        budget: '{n} ảnh tốt',
      },
      table: {
        caption: 'Khoảng giá trị qua 8 seed. TP trên 26 ảnh lỗi, FP trên 107 ảnh đạt chuẩn.',
        head: ['Biến thể', 'TP, 10 ảnh', 'FP, 10 ảnh', 'TP, 15 ảnh', 'FP, 15 ảnh'],
        rows: rows([
          'Mốc: khoảng cách tới lân cận gần nhất',
          'Trung bình 3 lân cận gần nhất',
          'Trọng số lại theo lân cận (kiểu PatchCore)',
          'Khoảng cách ÷ bán kính cục bộ',
          'Khoảng cách − bán kính cục bộ',
          'Ngữ cảnh viền 32 px',
          'Ngữ cảnh viền 64 px',
          'Ngưỡng cross-fit, MAD',
          'Ngưỡng cross-fit, q95 × 1,10',
          'Ngưỡng cross-fit, max × 1,10',
        ]),
      },
      p: [
        'Không điểm vận hành nào đạt. Những quy tắc ít báo nhầm có được điều đó nhờ đẩy ngưỡng lên cao tới mức bỏ sót phần lớn lỗi, chứ không phải nhờ phân biệt ảnh tốt và ảnh lỗi tốt hơn.',
      ],
    },
    {
      h: 'Lỗi ở ngưỡng hay ở điểm số?',
      p: [
        'Để kiểm tra, mình cố ý "gian lận": chọn ngưỡng bằng nhãn của tập test. Ngay cả vậy, muốn giữ 25 lỗi thì mốc vẫn phải chịu ít nhất 4–5 báo nhầm, các điểm số khác 4–7. Vậy vấn đề nằm ở cách điểm số xếp thứ tự ảnh, không chỉ ở chỗ đặt ngưỡng.',
        'Bốn ảnh đạt chuẩn (145, 179, 183 và 218) bị báo nhầm ở cả 8 seed với cả hai ngân sách. Chúng có cấu trúc cục bộ và các dải texture ngang mà đặc trưng coi như lỗi. Mình giữ nguyên nhãn: trông giống lỗi không phải bằng chứng nhãn sai.',
      ],
    },
    {
      h: 'Những hướng khác cũng không đạt',
      list: [
        'Chọn ảnh đạt chuẩn trải đều cả cuộn thay vì lấy ở đầu cuộn: trung vị báo nhầm 8 so với 8,5 trên tập holdout mới 83 ảnh, và không bank nào trong 32 bank đạt mục tiêu ≤ 2/83.',
        'Trừ nền theo từng hàng khỏi điểm số: vẫn bắt 25 lỗi, vẫn báo nhầm 4–13.',
        'Giữ toàn bộ 11.760 patch mỗi ảnh, bank lớn gấp 23 lần: báo nhầm đổi −3, +1 và 0 ở ba seed, trong khi độ trễ P95 tăng từ khoảng 30 ms lên 272 ms trên RTX A4000.',
        'Ensemble 9 bank con, và so mỗi patch với vùng xa trong chính ảnh đó: không điểm nào đạt.',
      ],
    },
    {
      h: 'Nút thắt nằm ở ngưỡng',
      p: [
        'Chạy chính pipeline đang triển khai, chỉ dùng 10 ảnh của bank để hiệu chỉnh, cho thấy lý do. Trong leave-one-out, chín trên mười ảnh đạt chuẩn có điểm từ 11 đến 22. Một ảnh đạt 38,2. Quy tắc lấy max đi theo đúng ảnh đó: bắt 7/26 lỗi, 0 báo nhầm. Lấy điểm cao thứ hai làm ngưỡng thì được 22/26 với 3/107, gần nhưng vẫn dưới mức 24/26 đang triển khai.',
        'Thêm 5 ảnh (tổng 15) không đổi một quyết định nào ở mức ảnh. Augment ảnh đạt chuẩn (độ sáng, gamma, dải theo hàng, dịch chuyển) chỉ nâng điểm 1,05–1,25 lần nhưng giữ nguyên thứ tự, nên không thay được ảnh đạt chuẩn độc lập.',
        'Mười ảnh đạt chuẩn đủ để dựng bank. Chúng chưa đủ để đặt ngưỡng.',
      ],
    },
    {
      h: 'Một hướng đáng thử, kèm lưu ý',
      p: [
        'Một thử nghiệm sau đó thêm nhánh DINOv2 bên cạnh PatchCore, và chỉ báo lỗi khi cả hai nhánh cùng vượt k lần trung vị điểm leave-one-out của chính nhánh đó. Với mục tiêu nới lỏng đặt cho sản phẩm (ít nhất 22/26, tối đa 5/107), cách này đạt ở 17/17 bộ ngẫu nhiên gồm 5–20 ảnh đạt chuẩn.',
        'Nhưng hai hệ số k được chọn từ lưới 36 ô trên chính tập test đó. Khi chọn trên một nửa tập test và kiểm tra trên nửa còn lại (300 lần chia ngẫu nhiên), tỉ lệ đạt chỉ còn 42%. Đây là hướng cần thử trên cuộn mới, chưa phải kết quả.',
      ],
    },
    {
      h: 'Điều mình rút ra',
      list: [
        'Với 10 ảnh đạt chuẩn, điểm số của pipeline đang triển khai vẫn xếp thứ tự ảnh với AUROC 0,95, vậy mà không quy tắc ngưỡng khóa trước nào đạt. Với dây chuyền sản xuất, hãy báo số đếm tại một ngưỡng cố định, không chỉ AUROC.',
        '3/107 không chứng minh tỉ lệ báo nhầm dưới 3%. Ngay cả 0/107 cũng chỉ cho cận trên khoảng 2,8% (một phía, 95%). Muốn chắc cần hàng trăm đến hàng nghìn ảnh đạt chuẩn độc lập.',
        'Khóa quy trình trước khi xem kết quả, và dừng tinh chỉnh trên một tập test đã xem quá nhiều lần.',
        'Ghi lại cả kết quả âm để lần thử sau không lặp lại ngõ cụt.',
      ],
    },
    {
      h: 'Giới hạn',
      p: [
        'Toàn bộ là công việc phát triển trên một cuộn và một tập test đã dùng lại nhiều lần. Nó không cho thấy few-shot nói chung thất bại, chỉ cho thấy các cấu hình này chưa đạt trên dữ liệu này.',
      ],
    },
  ],
};

export const notes: Record<Lang, Note[]> = { en: [en], vi: [vi] };
