export const TEAM_STAFF = {
  Mexico: coach("Javier Aguirre", "哈维尔·阿吉雷"),
  "South Africa": coach("Hugo Broos", "雨果·布罗斯"),
  "South Korea": coach("Hong Myung-bo", "洪明甫"),
  Czechia: coach("Miroslav Koubek", "米罗斯拉夫·库贝克"),
  Canada: coach("Jesse Marsch", "杰西·马什"),
  "Bosnia and Herzegovina": coach("Sergej Barbarez", "谢尔盖·巴尔巴雷兹"),
  Qatar: coach("Julen Lopetegui", "胡伦·洛佩特吉"),
  Switzerland: coach("Murat Yakin", "穆拉特·雅金"),
  Brazil: coach("Carlo Ancelotti", "卡洛·安切洛蒂"),
  Morocco: coach("Mohamed Ouahbi", "穆罕默德·瓦赫比"),
  Haiti: coach("Sébastien Migné", "塞巴斯蒂安·米涅"),
  Scotland: coach("Steve Clarke", "史蒂夫·克拉克"),
  "United States": coach("Mauricio Pochettino", "毛里西奥·波切蒂诺"),
  Paraguay: coach("Gustavo Alfaro", "古斯塔沃·阿尔法罗"),
  Australia: coach("Tony Popovic", "托尼·波波维奇"),
  Turkey: coach("Vincenzo Montella", "文森佐·蒙特拉"),
  Germany: coach("Julian Nagelsmann", "尤利安·纳格尔斯曼"),
  "New Zealand": coach("Darren Bazeley", "达伦·巴泽利"),
  "Ivory Coast": coach("Emerse Faé", "埃梅尔斯·法埃"),
  Ecuador: coach("Sebastián Beccacece", "塞巴斯蒂安·贝卡塞塞"),
  Netherlands: coach("Ronald Koeman", "罗纳德·科曼"),
  Japan: coach("Hajime Moriyasu", "森保一"),
  Sweden: coach("Graham Potter", "格雷厄姆·波特"),
  Tunisia: coach("Sabri Lamouchi", "萨布里·拉穆希"),
  England: coach("Thomas Tuchel", "托马斯·图赫尔"),
  Ghana: coach("Carlos Queiroz", "卡洛斯·奎罗斯"),
  Panama: coach("Thomas Christiansen", "托马斯·克里斯蒂安森"),
  Serbia: coach("Veljko Paunović", "韦利科·保诺维奇", "需按官方参赛名单复核"),
  Spain: coach("Luis de la Fuente", "路易斯·德拉富恩特"),
  "Cape Verde": coach("Bubista", "布比斯塔"),
  "Saudi Arabia": coach("Hervé Renard", "埃尔韦·勒纳尔"),
  Uruguay: coach("Marcelo Bielsa", "马塞洛·贝尔萨"),
  France: coach("Didier Deschamps", "迪迪埃·德尚"),
  Senegal: coach("Pape Thiaw", "帕普·蒂奥"),
  Iraq: coach("Graham Arnold", "格雷厄姆·阿诺德"),
  Norway: coach("Ståle Solbakken", "斯托勒·索尔巴肯"),
  Argentina: coach("Lionel Scaloni", "利昂内尔·斯卡洛尼"),
  Algeria: coach("Vladimir Petković", "弗拉基米尔·佩特科维奇"),
  Austria: coach("Ralf Rangnick", "拉尔夫·朗尼克"),
  Jordan: coach("Jamal Sellami", "贾迈勒·塞拉米"),
  Portugal: coach("Roberto Martínez", "罗伯托·马丁内斯"),
  "DR Congo": coach("Sébastien Desabre", "塞巴斯蒂安·德萨布尔"),
  Uzbekistan: coach("Fabio Cannavaro", "法比奥·卡纳瓦罗"),
  Colombia: coach("Néstor Lorenzo", "内斯托尔·洛伦索"),
  Croatia: coach("Zlatko Dalić", "兹拉特科·达利奇"),
  Iran: coach("Amir Ghalenoei", "阿米尔·加莱诺埃"),
  Jamaica: coach("TBD", "待核验", "需按官方参赛名单复核"),
  Belgium: coach("Rudi Garcia", "鲁迪·加西亚")
};

export function coachForCountry(country) {
  return TEAM_STAFF[country] ?? coach("TBD", "待核验", "未收录");
}

function coach(name, chineseName, note = "公开资料快照") {
  return { name, chineseName, note };
}
