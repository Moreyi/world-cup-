const DEFAULT_TACTIC = {
  shape: "4-2-3-1 / 4-3-3",
  style: "中位防守，依靠边路推进和定位球制造机会",
  attack: "边路推进、二点球和反击第一脚",
  defense: "压缩中路，保护禁区前沿",
  risk: "被对手持续压迫时，出球稳定性会下降",
  coachPlan: "主帅更可能先求结构稳定，再根据比分调整压迫高度。"
};

export const TEAM_TACTICS = {
  Canada: tactic(
    "4-2-3-1 / 4-4-2",
    "高节奏边路冲击，左路速度和前场逼抢是主要武器",
    "Davies 一侧推进、David 前插、二线跟进",
    "前场压迫后快速回收，保护肋部",
    "如果压迫被绕过，中卫身后和弱侧回防会吃压力",
    "Marsch 倾向把比赛拉快：前 20 分钟压迫强度、二点球回收和左路纵深是关键。"
  ),
  "Bosnia and Herzegovina": tactic(
    "4-2-3-1",
    "更偏稳守和中路组织，等待定位球与中锋支点",
    "中路直塞、边路传中、定位球抢点",
    "双后腰保护禁区，优先降低比赛节奏",
    "面对持续冲刺型边锋，边后卫一对一压力较大",
    "Barbarez 更需要控制情绪和节奏：先守住中路，再用定位球和支点前锋找机会。"
  ),
  "United States": tactic(
    "4-3-3",
    "主场主动压迫，靠边锋内切和中场覆盖制造连续进攻",
    "Pulisic 一侧单点突破，中场前插和反抢后的二次进攻",
    "高位逼抢配合中场扫荡，尽量把对手压回半场",
    "阵地战中锋支点和防线身后空间是波动点",
    "Pochettino 会要求更主动的前压和快速反抢，边锋能否打穿第一道防线决定上限。"
  ),
  Paraguay: tactic(
    "4-4-2 / 4-2-3-1",
    "防守韧性强，倾向身体对抗、定位球和快速纵向推进",
    "长传找前锋、边路二过一、定位球",
    "低位紧凑防守，限制对方中路渗透",
    "如果早早丢球，需要压出来时创造力会受考验",
    "Alfaro 的核心是纪律和耐心：低位站住、制造身体对抗，把比赛拖进低比分区间。"
  )
};

export function tacticForCountry(country) {
  return TEAM_TACTICS[country] ?? DEFAULT_TACTIC;
}

export function buildTacticalPreview(match) {
  const tacticA = tacticForCountry(match.teamA.name);
  const tacticB = tacticForCountry(match.teamB.name);
  const favoriteSide = match.probabilities.teamA >= match.probabilities.teamB ? "teamA" : "teamB";
  const favoriteTactic = favoriteSide === "teamA" ? tacticA : tacticB;
  const underdogTactic = favoriteSide === "teamA" ? tacticB : tacticA;

  return {
    teamA: tacticA,
    teamB: tacticB,
    duel: `${favoriteTactic.attack} 对 ${underdogTactic.defense}`,
    prediction: buildTacticalPrediction(match, tacticA, tacticB),
    dataNote: "友谊赛/近期热身赛果待接公开赛果源；当前战术判断来自球队风格、主帅倾向和模型强弱差。"
  };
}

function buildTacticalPrediction(match, tacticA, tacticB) {
  if (match.edge < 0.06) return `两队胜率接近，${tacticA.defense} 与 ${tacticB.defense} 会让平局权重偏高。`;
  const favoriteTactic = match.probabilities.teamA >= match.probabilities.teamB ? tacticA : tacticB;
  return `优势方更适合主动拿球，关键在于把 ${favoriteTactic.attack} 转化成高质量射门。`;
}

function tactic(shape, style, attack, defense, risk, coachPlan) {
  return { shape, style, attack, defense, risk, coachPlan };
}
