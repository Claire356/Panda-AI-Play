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

## 首页与角色恢复（2026-11-01）

开场现在直接嵌入首页，静音自动播放 20 秒后停止；随时可暂停、重播或放大观看。进入游戏、打开完整开场或隐藏页面会暂停首页动画。偏好减少动态时只展示静态首帧，用户仍可主动播放。首次访问不再弹出遮挡入口的自动对话框；三档玩法始终可以直接进入。

保留简短主线：查一条记录 → 选择态度 → 说一句理由。新增角色不增加步骤：狐狸先生、园丁阿栗（松鼠）、记录员小灯（熊猫）按提案 ID 出场，翻开记录有短暂纸页动效，结果揭晓与实际人物名称相符的狐狸、大象或候鸟。角色表情不暗示提案正确性；入场、翻页和揭晓均为短动画，无无限循环。

新增角色图集：`dist/assets/auction-cast-v1.png`。使用内置 `image_gen` 生成；原图保留在生成目录，项目复制使用。图集共 3 列、2 行，以 CSS 视窗展示单个角色。请求透明背景，实际产物带有暖色背景，因此采用圆形肖像，未通过程序修改图片内容。

最终生成提示词（原文）：

> Use case: illustration-story. Asset type: a production sprite atlas for a whimsical forest auction research game, transparent background. Create ONE precisely aligned 3-column by 2-row contact sheet, 1536 by 1024 proportions, six equal square cells without any drawn grid. Each cell contains ONE centered waist-up cartoon animal with ample transparent padding, all faces and props fully inside its own cell, no overlapping between cells. Consistent premium soft 3D clay storybook illustration, appealing expressive eyes, matte detailed fur, gentle warm amber rim light, deep forest green and cream clothing, polished indie game character art, not flat icons, not photoreal. Row 1 left: charming orange red fox auctioneer wearing a green waistcoat, holding a small wooden auction gavel, friendly neutral confident expression. Row 1 center: cheerful brown squirrel gardener in moss green overalls, holding a little potted sprout and paper notebook, neutral curious expression. Row 1 right: round friendly black-and-white panda archivist wearing thin round brass spectacles and teal cardigan, holding a closed cream ledger and small lantern. Row 2 left: curious orange fox researcher with a magnifying glass and olive neck scarf, a distinct character portrait for a research-personality card. Row 2 center: thoughtful gentle young grey elephant researcher wearing a sage scarf and holding a notebook. Row 2 right: friendly migrating swallow bird researcher with teal wings, cream chest and small orange travel scarf, wings lightly resting on a folded map. All six centered portraits at equal scale, identical soft light, transparent pixels between each figure, complete character heads with no cropped ears or trunk, clean alpha edges, no scenery or ground, no labels, text, watermarks, badges, rectangles or borders. This is one coordinated set for three vendor portraits and three player-personality portraits.
