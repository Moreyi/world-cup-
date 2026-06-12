// Groups verified against ESPN FIFA World Cup standings (retrieved 2026-06-12).
// Elo ratings are real values from eloratings.net (retrieved 2026-06-12), used as-is.
// Team order inside each group follows the real matchday-1 pairing (1v2, 3v4).
export const STARTER_GROUPS = [
  {
    name: "A",
    teams: [
      { name: "Mexico", elo: 1881, host: true },
      { name: "South Africa", elo: 1511 },
      { name: "South Korea", elo: 1786 },
      { name: "Czechia", elo: 1712 }
    ]
  },
  {
    name: "B",
    teams: [
      { name: "Canada", elo: 1788, host: true },
      { name: "Bosnia and Herzegovina", elo: 1595 },
      { name: "Qatar", elo: 1421 },
      { name: "Switzerland", elo: 1891 }
    ]
  },
  {
    name: "C",
    teams: [
      { name: "Brazil", elo: 1991 },
      { name: "Morocco", elo: 1827 },
      { name: "Haiti", elo: 1548 },
      { name: "Scotland", elo: 1782 }
    ]
  },
  {
    name: "D",
    teams: [
      { name: "United States", elo: 1726, host: true },
      { name: "Paraguay", elo: 1834 },
      { name: "Australia", elo: 1777 },
      { name: "Turkey", elo: 1911 }
    ]
  },
  {
    name: "E",
    teams: [
      { name: "Germany", elo: 1932 },
      { name: "Curacao", elo: 1434 },
      { name: "Ivory Coast", elo: 1695 },
      { name: "Ecuador", elo: 1938 }
    ]
  },
  {
    name: "F",
    teams: [
      { name: "Netherlands", elo: 1948 },
      { name: "Japan", elo: 1906 },
      { name: "Sweden", elo: 1712 },
      { name: "Tunisia", elo: 1628 }
    ]
  },
  {
    name: "G",
    teams: [
      { name: "Belgium", elo: 1894 },
      { name: "Egypt", elo: 1696 },
      { name: "Iran", elo: 1772 },
      { name: "New Zealand", elo: 1562 }
    ]
  },
  {
    name: "H",
    teams: [
      { name: "Spain", elo: 2157 },
      { name: "Cape Verde", elo: 1578 },
      { name: "Saudi Arabia", elo: 1576 },
      { name: "Uruguay", elo: 1892 }
    ]
  },
  {
    name: "I",
    teams: [
      { name: "France", elo: 2063 },
      { name: "Senegal", elo: 1860 },
      { name: "Iraq", elo: 1607 },
      { name: "Norway", elo: 1914 }
    ]
  },
  {
    name: "J",
    teams: [
      { name: "Argentina", elo: 2115 },
      { name: "Algeria", elo: 1772 },
      { name: "Austria", elo: 1830 },
      { name: "Jordan", elo: 1680 }
    ]
  },
  {
    name: "K",
    teams: [
      { name: "Portugal", elo: 1989 },
      { name: "DR Congo", elo: 1652 },
      { name: "Uzbekistan", elo: 1714 },
      { name: "Colombia", elo: 1982 }
    ]
  },
  {
    name: "L",
    teams: [
      { name: "England", elo: 2024 },
      { name: "Croatia", elo: 1912 },
      { name: "Ghana", elo: 1510 },
      { name: "Panama", elo: 1730 }
    ]
  }
];
