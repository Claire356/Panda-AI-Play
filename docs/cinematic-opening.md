# 20 秒电影感开场

2026-11-01：把原平面插画开场替换为写实材质的拍卖厅场景。采用两张 AI 生成图片配合网页镜头运动、淡入和字幕，是 2.5D 动态开场，不是实拍录像，也不是人物连续动作视频。

## 分镜

| 时间 | 镜头 | 剧情 |
| --- | --- | --- |
| 0–5 秒 | 拍卖厅全景缓推 | 收到三份策略提案 |
| 5–10 秒 | 狐狸拍卖师近景 | 听见笃定的承诺 |
| 10–15 秒 | 放大镜与底稿特写 | 发现需要查证的线索 |
| 15–20 秒 | 木槌近景与邀请字幕 | 将判断交给玩家 |

支持暂停、拖动、重播和跳过；跳过或结束后的入场按钮进入圣杯拍卖会。默认静音，可主动开启合成氛围音。隐藏页面暂停；系统偏好减少动态时不自动播放，关闭镜头缩放。

## 素材与生成提示词

两张原创场景由内置 image_gen 工具生成。第二张以前一张作为参考保持材质与色调一致。画面上的金融线条仅为剧情美术，不作为数据图表。

- `dist/assets/auction-room-v1.png`：拍卖厅与狐狸。
- `dist/assets/auction-evidence-v1.png`：放大镜、底稿、铜币和木槌。

提示词组（制作描述）：

1. Cinematic realistic 16:9 private auction room at night, forest-green velvet, warm brass lamps, dark walnut table, blurred bookshelves, volumetric light. A believable anthropomorphic red fox auctioneer in a tailored green waistcoat, detailed fur, expressive face. An aged paper dossier, three brass tokens and a wooden gavel in foreground. Eye-level 35mm cinema lens, amber light against teal shadows, real textures, film grain. Keep key subjects within central 70% for responsive cropping. No text, logos, UI, borders or readable financial values.
2. The next shot in the same room: a shallow-angle tabletop close-up. A brass magnifying glass over a paper research dossier, fine unlabeled candlestick traces and a temporal arrow. Three brass tokens lower left, dark wooden gavel upper right, fox hand and waistcoat softly blurred in background. Preserve walnut, green leather, amber light and teal shadows; shallow depth of field, sharp paper fibers and brass rim, subtle lens reflection. No readable words, numbers, logos or UI.

验证：自动化检查分镜边界、拖动边界、减少动态模式与结尾触发；浏览器确认图片加载、拖动切镜、20 秒停播和进入拍卖会。
