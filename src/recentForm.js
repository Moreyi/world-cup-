export const RECENT_FORM = {
  Canada: {
    source: "Canada results 2020-present, last checked 2026-06-12",
    multiYear: "2022 世界杯小组赛三战皆负但完成重返世界杯；2024 美洲杯首次参赛拿到第四名，证明防守组织和反击能对抗南美强队。",
    summary: "2026 热身 1胜3平，防守稳定但平局偏多；Davies 状态会显著影响左路爆点。",
    matches: [
      recent("2026-03-28", "Iceland", "2-2", "Friendly"),
      recent("2026-03-31", "Tunisia", "0-0", "Friendly"),
      recent("2026-06-01", "Uzbekistan", "2-0", "Friendly"),
      recent("2026-06-05", "Republic of Ireland", "1-1", "Friendly")
    ]
  },
  "Bosnia and Herzegovina": {
    source: "Bosnia records/statistics and pre-match reports, last checked 2026-06-12",
    multiYear: "2014 后长期缺席世界杯；Barbarez 2024 接手后完成换代与凝聚，2026 附加赛连过 Wales、Italy，抗压和点球心态是关键资产。",
    summary: "通过欧洲附加赛进入世界杯，节奏更偏稳守与定位球；完整友谊赛逐场比分待补源。",
    matches: [recent("2026-03-31", "Italy", "1-1", "World Cup qualifying playoff")]
  },
  "United States": {
    source: "United States results page, last checked 2026-06-12",
    multiYear: "2022 世界杯进 16 强；2024 美洲杯小组出局后换帅，Pochettino 周期重点是把主场优势和高压打法重新捏合。",
    summary: "2026 年 3 月热身连续失利，主场首战需要用高压和边路质量修正信心。",
    matches: [
      recent("2026-03-28", "European opponent", "2-5", "Friendly"),
      recent("2026-03-31", "Portugal", "0-2", "Friendly")
    ]
  },
  Paraguay: {
    source: "Paraguay team page and coaching staff, last checked 2026-06-12",
    multiYear: "连续缺席多届世界杯后回归，南美预选赛靠防守韧性、主场强度和关键胜利抢到直接晋级位置。",
    summary: "Alfaro 体系重视低位纪律、对抗和定位球；完整近赛逐场比分待补源。",
    matches: [recent("2026-06-05", "Nicaragua", "score pending", "Friendly / squad reference")]
  },
  Australia: {
    source: "Socceroos 2026 friendlies (Goal.com / socceroos.com.au), last checked 2026-06-13",
    multiYear: "亚洲区稳定参赛的常客,2022 世界杯闯入 16 强;Popovic 周期强调高强度逼抢与边路冲击,但对强队后防容易被打穿。",
    summary: "赛前热身起伏明显(近 5 战 2胜1平2负、失 6 球):5-1 大胜库拉索亮眼,却 0-3 负哥伦比亚、0-1 负墨西哥,6/6 1-1 平瑞士收官。对土耳其需解决防强队的稳定性。",
    matches: [
      recent("2026-06-06", "Switzerland", "1-1", "Friendly"),
      recent("2026-06-02", "Mexico", "0-1", "Friendly"),
      recent("2026-03-31", "Curacao", "5-1", "Friendly")
    ]
  },
  Turkey: {
    source: "Turkiye 2026 friendlies (Goal.com / FotMob), last checked 2026-06-13",
    multiYear: "Montella 接手后进攻端明显升级,2024 欧洲杯进 8 强;锋线 / 边路个人能力强,问题在防守专注度和客场稳定性。",
    summary: "赛前热身两连胜且零封:6/1 4-0 北马其顿、6/6 2-1 委内瑞拉,进攻火力充足、状态正盛。Elo(1911)明显高于澳大利亚,是 D 组开赛日的实力方。",
    matches: [
      recent("2026-06-06", "Venezuela", "2-1", "Friendly"),
      recent("2026-06-01", "North Macedonia", "4-0", "Friendly")
    ]
  },
  Germany: {
    source: "DFB 2026 friendlies (FourFourTwo / Goal.com), last checked 2026-06-13",
    multiYear: "传统豪门,Nagelsmann 周期以 Wirtz / Musiala / Havertz 为核心重建进攻;2024 主场欧洲杯进 8 强后状态回升。",
    summary: "赛前状态极佳(连胜、进 18 失 5):5/31 4-0 芬兰、2-1 胜美国收官,40 岁的 Neuer 已确认伤愈可出战库拉索。E 组开赛日对鱼腩,主要变数是把握机会的效率。",
    matches: [
      recent("2026-06-07", "United States", "2-1", "Friendly"),
      recent("2026-05-31", "Finland", "4-0", "Friendly")
    ]
  },
  Curacao: {
    source: "Curacao 2026 squad / friendlies (FIFA / FourFourTwo), last checked 2026-06-13",
    multiYear: "队史首次闯入世界杯决赛圈,由荷兰名帅 Dick Advocaat 带队;球员多为荷甲 / 欧洲二线背景,世界杯级别经验有限。",
    summary: "处子秀身份、热身样本偏弱:3/31 1-5 惨负澳大利亚、3/27 0-2 负中国,面对欧洲强队防线压力大。对德国是明显的以弱搏强,失球数是最大风险。",
    matches: [
      recent("2026-05-30", "Scotland", "score pending", "Friendly"),
      recent("2026-03-31", "Australia", "1-5", "Friendly"),
      recent("2026-03-27", "China PR", "0-2", "Friendly")
    ]
  },
  Netherlands: {
    source: "Netherlands 2026 friendlies (ESPN / Goal.com), last checked 2026-06-13",
    multiYear: "稳定的世界强队,2022 世界杯进 8 强、2024 欧洲杯进 4 强;Koeman 体系传控扎实,近年短板在终结效率和大赛临门一脚。",
    summary: "赛前热身喜忧参半:6/3 0-1 爆冷负阿尔及利亚(控球占优但效率低),6/8 2-1 胜乌兹别克回暖。模型只给 41% 正反映对日本并非稳赢,终结效率是关键。",
    matches: [
      recent("2026-06-08", "Uzbekistan", "2-1", "Friendly"),
      recent("2026-06-03", "Algeria", "0-1", "Friendly")
    ]
  },
  Japan: {
    source: "Japan 2026 results (ESPN / Nippon.com), last checked 2026-06-13",
    multiYear: "亚洲一流强队,2022 世界杯小组力压德国 / 西班牙出线;旅欧球员厚度高,擅长快速转换与高位压迫,被视为最危险的'伪弱旅'。",
    summary: "状态火热:3 月热身赛先后 1-0 击败苏格兰与英格兰,5/31 再 1-0 胜冰岛,近 5 战 3 胜、进 11 失 4。Elo(1906)紧咬荷兰,模型把对荷兰列为明日平局 / 爆冷敏感场。",
    matches: [
      recent("2026-05-31", "Iceland", "1-0", "Friendly"),
      recent("2026-03-28", "England", "1-0", "Friendly"),
      recent("2026-03-25", "Scotland", "1-0", "Friendly")
    ]
  },
  "Ivory Coast": {
    source: "Ivory Coast 2026 friendlies (Al Jazeera / ESPN), last checked 2026-06-13",
    multiYear: "2023(2024 初)非洲杯主场夺冠的劲旅,Emerse Fae 带队后凝聚力强;旅欧锋线与边路速度突出,身体对抗占优。",
    summary: "状态强势(近 5 战 4 胜、进 12 失 4):6/4 在南特 2-1 逆转法国(Amad Diallo 绝杀),向世界杯热门发出警告。虽 Elo 低于厄瓜多尔,但绝非鱼腩。",
    matches: [
      recent("2026-06-04", "France", "2-1", "Friendly")
    ]
  },
  Ecuador: {
    source: "Ecuador 2026 friendlies (World Soccer Talk / NBC4), last checked 2026-06-13",
    multiYear: "南美预选赛防守惊艳(18 场仅失 5 球拿 29 分),Beccacece 体系低位坚固、反击犀利;球员年轻、对抗与体能出色。",
    summary: "赛前保持不败、势头极佳:最后一场热身 3-0 胜危地马拉,延续 19 场不败;此前 1-1 平美国、1-1 平墨西哥、0-0 平加拿大。防守是最大资产,模型给 64% 占优。",
    matches: [
      recent("2026-06-07", "Guatemala", "3-0", "Friendly"),
      recent("2026-06-03", "Mexico", "1-1", "Friendly"),
      recent("2026-03-28", "United States", "1-1", "Friendly")
    ]
  },
  Sweden: {
    source: "Sweden 2026 friendlies (ESPN / UEFA), last checked 2026-06-13",
    multiYear: "经历换代的北欧球队,Graham Potter 2025 年 10 月回归后,靠附加赛连过乌克兰、波兰惊险晋级;队长 Lindelöf,打法务实。",
    summary: "赛前状态平平:6/4 0-1 负希腊,进攻乏力。Elo(1712)与突尼斯接近,模型把对突尼斯列为平局敏感场,体能调度在极端高温下是隐患。",
    matches: [
      recent("2026-06-04", "Greece", "0-1", "Friendly")
    ]
  },
  Tunisia: {
    source: "Tunisia 2026 friendlies (ESPN / DailySports), last checked 2026-06-13",
    multiYear: "非洲常客但从未小组出线,Sabri Lamouchi 带队主打防守纪律与定位球;球员个人能力有限,需要整体协防弥补。",
    summary: "赛前状态低迷(近 5 战 1 胜、失 7 球):0-5 惨负比利时、0-1 负奥地利、0-0 平加拿大,仅 1-0 小胜海地。进攻贫瘠是硬伤,但模型给的高温耐受边际(+18)可能在瓜达卢佩夜战帮上忙。",
    matches: [
      recent("2026-06-06", "Belgium", "0-5", "Friendly"),
      recent("2026-06-02", "Austria", "0-1", "Friendly"),
      recent("2026-03-28", "Haiti", "1-0", "Friendly")
    ]
  },
  Spain: {
    source: "Spain 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2018、2022 世界杯均止步 16 强(2022 点球负摩洛哥);2024 欧洲杯夺冠,亚马尔、佩德里领衔的新一代强势崛起;欧洲区预选头名直接晋级。",
    summary: "赛前状态火热,6/8 3-1 胜秘鲁,进攻流畅、效率高,是夺冠头号热门之一。",
    matches: [recent("2026-06-08", "Peru", "3-1", "Friendly")]
  },
  France: {
    source: "France 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2018 世界杯冠军、2022 亚军(决赛点球负阿根廷);2024 欧洲杯止步 4 强;德尚执教,欧洲区顺利出线,锋线星光熠熠。",
    summary: "热身一胜一负:6/8 3-1 胜北爱尔兰(奥利塞帽子戏法),但 6/5 爆冷 1-2 负科特迪瓦,后防需收紧。",
    matches: [
      recent("2026-06-08", "Northern Ireland", "3-1", "Friendly"),
      recent("2026-06-05", "Ivory Coast", "1-2", "Friendly")
    ]
  },
  England: {
    source: "England 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2018 世界杯第 4、2022 八强;2024 欧洲杯亚军(决赛负西班牙);Tuchel 接掌帅印,欧洲区出线,阵容厚度足。",
    summary: "赛前两连胜且零失球:6/10 3-0 胜哥斯达黎加、6/6 1-0 小胜新西兰,防线稳固。",
    matches: [
      recent("2026-06-10", "Costa Rica", "3-0", "Friendly"),
      recent("2026-06-06", "New Zealand", "1-0", "Friendly")
    ]
  },
  Portugal: {
    source: "Portugal 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2016 欧洲杯冠军、2024 欧洲杯八强(点球出局);2018 世界杯 16 强、2022 八强;C 罗领衔的新老结合,欧洲区出线。",
    summary: "热身两连胜:6/10 2-1 胜尼日利亚、6/6 2-1 胜智利,临场效率不俗。",
    matches: [
      recent("2026-06-10", "Nigeria", "2-1", "Friendly"),
      recent("2026-06-06", "Chile", "2-1", "Friendly")
    ]
  },
  Belgium: {
    source: "Belgium 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2018 世界杯季军(队史最佳)、2022 小组出局;2024 欧洲杯 16 强;黄金一代更替中,仍具即战力,欧洲区出线。",
    summary: "赛前两连胜势头强劲:6/6 5-0 大胜突尼斯、6/2 2-0 客胜克罗地亚,火力全开。",
    matches: [
      recent("2026-06-06", "Tunisia", "5-0", "Friendly"),
      recent("2026-06-02", "Croatia", "2-0", "Friendly")
    ]
  },
  Croatia: {
    source: "Croatia 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2018 世界杯亚军、2022 季军;2024 欧洲杯小组出局;Modric 压阵的老将班底经验丰富,欧洲区出线。",
    summary: "热身一胜一负:6/7 2-1 绝杀斯洛文尼亚(Modric、Pasalic 建功),6/2 0-2 负比利时。",
    matches: [
      recent("2026-06-07", "Slovenia", "2-1", "Friendly"),
      recent("2026-06-02", "Belgium", "0-2", "Friendly")
    ]
  },
  Austria: {
    source: "Austria 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "无缘 2018/2022 世界杯;2024 欧洲杯小组头名出线后 16 强出局;时隔多年重返世界杯,欧洲区出线。",
    summary: "近期状态稳健:6/1 1-0 小胜突尼斯,3 月热身 5-1 大胜加纳,赛前五战四胜一平。",
    matches: [
      recent("2026-06-01", "Tunisia", "1-0", "Friendly"),
      recent("2026-03-27", "Ghana", "5-1", "Friendly")
    ]
  },
  Switzerland: {
    source: "Switzerland 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2021 欧洲杯八强(点球淘汰法国)、2024 欧洲杯再进八强(点球负英格兰);2018 世界杯 16 强、2022 小组出局,大赛稳定。",
    summary: "赛前热身 6/6 1-1 战平澳大利亚(Ndoye 破门后被扳平),状态平稳,B 组实力方。",
    matches: [recent("2026-06-06", "Australia", "1-1", "Friendly")]
  },
  Norway: {
    source: "Norway 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "自 1998 年后长期无缘世界杯决赛圈;Haaland 领衔的新一代崛起,时隔 28 年重返世界杯,锋线火力强。",
    summary: "赛前热身 6/7 1-1 平摩洛哥(厄德高扳平)、6/3 3-1 力克瑞典,进攻端犀利。",
    matches: [
      recent("2026-06-07", "Morocco", "1-1", "Friendly"),
      recent("2026-06-03", "Sweden", "3-1", "Friendly")
    ]
  },
  Czechia: {
    source: "Czechia 2026 results (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2021 欧洲杯八强(淘汰荷兰)、2024 欧洲杯小组出局;2018、2022 两届世界杯缺席,本届重返决赛圈。",
    summary: "热身 3-1 胜危地马拉、2-1 胜科索沃,但揭幕战 1-2 不敌韩国遭遇开门黑。",
    matches: [
      recent("2026-06-12", "South Korea", "1-2", "World Cup"),
      recent("2026-06-05", "Guatemala", "3-1", "Friendly"),
      recent("2026-05-31", "Kosovo", "2-1", "Friendly")
    ]
  },
  Scotland: {
    source: "Scotland 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2021、2024 连续两届欧洲杯小组出局;世界杯则是 1998 年后首次重返决赛圈,本届意义重大。",
    summary: "赛前两场热身全胜状态火热:6/6 4-0 大胜玻利维亚、5/30 4-1 胜库拉索,信心十足。",
    matches: [
      recent("2026-06-06", "Bolivia", "4-0", "Friendly"),
      recent("2026-05-30", "Curacao", "4-1", "Friendly")
    ]
  },
  Qatar: {
    source: "Qatar 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2022 年东道主三战全负小组垫底;但亚洲赛场强势,2019、2023 连续两届亚洲杯夺冠,20 年来首支卫冕亚洲杯的球队。",
    summary: "赛前最后一场热身 6/6 0-0 闷平萨尔瓦多,进攻乏力,备战平淡。",
    matches: [recent("2026-06-06", "El Salvador", "0-0", "Friendly")]
  },
  Argentina: {
    source: "Argentina 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "卫冕底蕴深厚:2022 世界杯夺冠、2024 美洲杯再度登顶;南美区预选高居前列,梅西时代余威仍在。",
    summary: "赛前热身全胜:6/9 3-0 冰岛、6/6 2-0 洪都拉斯,状态火热并重返 FIFA 世界第一。",
    matches: [
      recent("2026-06-09", "Iceland", "3-0", "Friendly"),
      recent("2026-06-06", "Honduras", "2-0", "Friendly")
    ]
  },
  Uruguay: {
    source: "Uruguay 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "传统劲旅:2024 美洲杯季军、2022 世界杯小组出局;Bielsa 执教下世预赛稳健提前出线。",
    summary: "热身偏保守:3/31 0-0 闷平阿尔及利亚、3/27 客场 1-1 温布利逼平英格兰(Valverde 绝平)。",
    matches: [
      recent("2026-03-31", "Algeria", "0-0", "Friendly"),
      recent("2026-03-27", "England", "1-1", "Friendly")
    ]
  },
  Colombia: {
    source: "Colombia 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "上升势头明显:2024 美洲杯亚军(决赛负阿根廷);本届南美区强势回归世界杯,L. Diaz 领衔。",
    summary: "赛前两连胜收尾:6/7 2-0 胜约旦(J. Arias 梅开二度)、6/3 3-1 胜哥斯达黎加。",
    matches: [
      recent("2026-06-07", "Jordan", "2-0", "Friendly"),
      recent("2026-06-03", "Costa Rica", "3-1", "Friendly")
    ]
  },
  Brazil: {
    source: "Brazil 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "桑巴军团:2022 世界杯八强、2024 美洲杯八强;南美区预选历经波折但稳定晋级,渴望队史第 6 冠。",
    summary: "赛前火力全开:6/6 2-1 胜埃及(Endrick 制胜)、5/31 马拉卡纳 6-2 大胜巴拿马(Vinicius 闪击)。",
    matches: [
      recent("2026-06-06", "Egypt", "2-1", "Friendly"),
      recent("2026-05-31", "Panama", "6-2", "Friendly")
    ]
  },
  Mexico: {
    source: "Mexico 2026 results (ESPN / FIFA), last checked 2026-06-13",
    multiYear: "本届东道主之一:2022 世界杯小组未出线、2024 美洲杯亦止步小组,近年大赛低迷,期待主场翻身。",
    summary: "主场揭幕战告捷:6/11 阿兹特克 2-0 南非(对手三红牌),此前热身 1-0 小胜澳大利亚。",
    matches: [
      recent("2026-06-11", "South Africa", "2-0", "World Cup"),
      recent("2026-05-30", "Australia", "1-0", "Friendly")
    ]
  },
  Panama: {
    source: "Panama 2026 friendlies (ESPN / Concacaf), last checked 2026-06-13",
    multiYear: "中北美黑马:2023 金杯赛亚军;世预赛中北美区力压群雄锁定世界杯名额,大赛经验逐步积累。",
    summary: "热身有得有失:6/7 1-1 平波黑,5/31 在马拉卡纳 2-6 负巴西暴露防线问题。",
    matches: [
      recent("2026-06-07", "Bosnia and Herzegovina", "1-1", "Friendly"),
      recent("2026-05-31", "Brazil", "2-6", "Friendly")
    ]
  },
  Haiti: {
    source: "Haiti 2026 friendlies (ESPN / Haitian Times), last checked 2026-06-13",
    multiYear: "时隔 1974 年后再进世界杯:加勒比球队代表,经中北美区世预赛艰难突围,首发大赛舞台。",
    summary: "热身一胜一负:6/2 佛州 4-0 大胜新西兰,6/5 1-2 不敌秘鲁。",
    matches: [
      recent("2026-06-05", "Peru", "1-2", "Friendly"),
      recent("2026-06-02", "New Zealand", "4-0", "Friendly")
    ]
  },
  Morocco: {
    source: "Morocco 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2022 世界杯历史性第 4(半决赛),首支闯入世界杯四强的非洲球队;Hakimi、Brahim Diaz 领衔,防守纪律极强。",
    summary: "赛前最后一场热身 6/7 1-1 战平挪威(Brahim Diaz 破门、厄德高扳平),整体状态稳健。",
    matches: [recent("2026-06-07", "Norway", "1-1", "Friendly")]
  },
  Egypt: {
    source: "Egypt 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "以 Salah 为核心,2021 非洲杯亚军(点球负塞内加尔);世预赛非洲区强势出线,此前长期无缘世界杯正赛。",
    summary: "赛前最后一场热身 6/6 1-2 不敌巴西(扳平后被 Endrick 绝杀),面对强队展现韧性。",
    matches: [recent("2026-06-06", "Brazil", "1-2", "Friendly")]
  },
  Ghana: {
    source: "Ghana 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2022 世界杯小组未出线,历史最佳为 2010 年八强;近年非洲杯起伏,由名帅 Queiroz 执教重建。",
    summary: "原定 6/9 对洪都拉斯的收官热身因对手退出取消,最近一战 6/2 1-1 客平威尔士。",
    matches: [recent("2026-06-02", "Wales", "1-1", "Friendly")]
  },
  Senegal: {
    source: "Senegal 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2022 世界杯 16 强、2021 非洲杯夺冠(点球胜埃及)、2019 非洲杯亚军,近年稳居非洲一流强队。",
    summary: "赛前最后一场热身 6/9 0-0 闷平沙特(Jackson 染红),终结此前 11 场连续进球纪录。",
    matches: [recent("2026-06-09", "Saudi Arabia", "0-0", "Friendly")]
  },
  Algeria: {
    source: "Algeria 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2019 非洲杯夺冠,但 2022 年无缘世界杯;本届时隔多届重返正赛,世预赛非洲区表现回升。",
    summary: "赛前势头火热:6/10 4-0 大胜玻利维亚、6/3 1-0 击败荷兰,状态出色。",
    matches: [
      recent("2026-06-10", "Bolivia", "4-0", "Friendly"),
      recent("2026-06-03", "Netherlands", "1-0", "Friendly")
    ]
  },
  "DR Congo": {
    source: "DR Congo 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "时隔数十年重返世界杯正赛(上次为 1974 年以扎伊尔身份);世预赛附加赛末段绝杀喀麦隆出线,近年非洲杯曾进四强。",
    summary: "赛前两场热身先 6/3 0-0 平丹麦,后 6/9 1-2 不敌智利,锋线效率待提升。",
    matches: [
      recent("2026-06-09", "Chile", "1-2", "Friendly"),
      recent("2026-06-03", "Denmark", "0-0", "Friendly")
    ]
  },
  "Cape Verde": {
    source: "Cape Verde 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "历史性首次晋级世界杯正赛:人口仅数十万的岛国,世预赛非洲区锁定资格,创造非洲足球奇迹。",
    summary: "赛前最后一场热身 6/6 3-0 完胜百慕大(Semedo、Rodrigues、Da Costa 建功),备战积极。",
    matches: [recent("2026-06-06", "Bermuda", "3-0", "Friendly")]
  },
  "South Africa": {
    source: "South Africa 2026 results (ESPN / Goal), last checked 2026-06-13",
    multiYear: "时隔多届重返世界杯正赛(上次为 2010 年东道主);非洲杯近年偶有惊艳但整体稳定性不足。",
    summary: "揭幕战 6/11 0-2 不敌东道主墨西哥(全场三红牌一度仅剩 9 人),赛前热身亦未尝胜绩。",
    matches: [
      recent("2026-06-11", "Mexico", "0-2", "World Cup"),
      recent("2026-06-07", "Nicaragua", "0-0", "Friendly")
    ]
  },
  Iran: {
    source: "Iran 2026 friendlies (ESPN / Al Jazeera), last checked 2026-06-13",
    multiYear: "亚洲传统强队:2022 世界杯小组出局、2023 亚洲杯四强;连续多届晋级世界杯。",
    summary: "赛前在土耳其安塔利亚集训,最后一场热身 6/4 2-0 完胜马里,状态尚可。",
    matches: [recent("2026-06-04", "Mali", "2-0", "Friendly")]
  },
  Iraq: {
    source: "Iraq 2026 friendlies (Goal / FIFA), last checked 2026-06-13",
    multiYear: "2007 年亚洲杯冠军;近年经亚洲区附加赛之路艰难晋级 2026 世界杯,Arnold 执教。",
    summary: "赛前热身先 6/4 1-1 逼平西班牙,随后 6/9 0-2 负委内瑞拉且吃红牌,防守存隐忧。",
    matches: [
      recent("2026-06-09", "Venezuela", "0-2", "Friendly"),
      recent("2026-06-04", "Spain", "1-1", "Friendly")
    ]
  },
  Jordan: {
    source: "Jordan 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2023 亚洲杯历史性闯入决赛获亚军;本届为队史首次晋级世界杯。",
    summary: "赛前热身 6/7 0-2 不敌哥伦比亚,面对强敌进攻乏力。",
    matches: [recent("2026-06-07", "Colombia", "0-2", "Friendly")]
  },
  "Saudi Arabia": {
    source: "Saudi Arabia 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "2022 世界杯小组赛爆冷 2-1 击败阿根廷惊艳世界;持续稳居亚洲强队之列。",
    summary: "赛前热身先 6/5 3-0 胜波多黎各,再 6/9 0-0 闷平塞内加尔(对手染红),防守稳健。",
    matches: [
      recent("2026-06-09", "Senegal", "0-0", "Friendly"),
      recent("2026-06-05", "Puerto Rico", "3-0", "Friendly")
    ]
  },
  Uzbekistan: {
    source: "Uzbekistan 2026 friendlies (ESPN / Sofascore), last checked 2026-06-13",
    multiYear: "本届历史性首次晋级世界杯,是亚洲新晋劲旅。",
    summary: "赛前两场热身先 6/2 0-2 负加拿大,再 6/6 1-2 惜败荷兰(Gakpo 双响),面对强队仍有差距。",
    matches: [
      recent("2026-06-06", "Netherlands", "1-2", "Friendly"),
      recent("2026-06-02", "Canada", "0-2", "Friendly")
    ]
  },
  "South Korea": {
    source: "South Korea 2026 results (ESPN / Yahoo), last checked 2026-06-13",
    multiYear: "2022 世界杯 16 强、2023 亚洲杯四强;核心孙兴慜,亚洲一流强队。",
    summary: "揭幕战(A 组)落后情况下 6/11 2-1 逆转捷克,赛前热身 5-0 大胜特立尼达,开门红。",
    matches: [
      recent("2026-06-11", "Czechia", "2-1", "World Cup"),
      recent("2026-05-30", "Trinidad and Tobago", "5-0", "Friendly")
    ]
  },
  "New Zealand": {
    source: "New Zealand 2026 friendlies (ESPN / Goal), last checked 2026-06-13",
    multiYear: "大洋洲冠军,时隔多届重返世界杯舞台,是大洋洲代表球队。",
    summary: "赛前状态低迷:6/2 0-4 惨败海地、6/6 0-1 小负英格兰,进攻乏力。",
    matches: [
      recent("2026-06-06", "England", "0-1", "Friendly"),
      recent("2026-06-02", "Haiti", "0-4", "Friendly")
    ]
  }
};

export function recentFormForCountry(country) {
  return RECENT_FORM[country] ?? {
    source: "待接公开赛果源",
    multiYear: "近几年大赛表现待补。",
    summary: "近期热身赛数据待补；当前预测主要依靠 Elo、阵容、主帅和战术模型。",
    matches: []
  };
}

function recent(date, opponent, score, type) {
  return { date, opponent, score, type };
}
