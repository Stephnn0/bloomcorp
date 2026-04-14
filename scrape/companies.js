const companies = [
  {
    name: "Outsmart Labs",
    email: "None",
    phone: "(305) 209-0807",
    address: "111 E Flagler St, Miami, FL 33131",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://outsmartlabs.com/?utm_source=GMB&utm_medium=Organic"
  },
  {
    name: "Solved Puzzle",
    email: "do@solvedpuzzle.com",
    phone: "(305) 487-7477",
    address: "990 Biscayne Blvd #503, Miami, FL 33132",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://solvedpuzzle.com/"
  },
  {
    name: "1111 Media Group | Websites - Content - Social - SEO - Paid",
    email: "info@1111mediagroup.com",
    phone: "(305) 351-3103",
    address: "1250 SW 27th Ave, Miami, FL 33135",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://1111mediagroup.com/miami"
  },
  {
    name: "Four 19 Digital Agency",
    email: "santiago@four19agency.com",
    phone: "(305) 492-9073",
    address: "1951 NW 7th Ave, Miami, FL 33136",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://four19agency.com/"
  },
  {
    name: "Jives Media",
    email: "brian@brianwhitney.com",
    phone: "(650) 420-7455",
    address: "78 SW 7th St, Miami, FL 33130",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://www.jivesmedia.com/digital-marketing-agency-in-miami/"
  },
  {
    name: "Raging Agency",
    email: "wght@400..600",
    phone: "(305) 575-2683",
    address: "2121 Biscayne Blvd #1275, Miami, FL 33137",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://ragingagency.com/"
  },
  {
    name: "Jeremy D. Boyd Advertising + Digital Marketing",
    email: "None",
    phone: "(305) 962-5194",
    address: "3050 Biscayne Blvd 9th Floor, Miami, FL 33137",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "http://calendly.com/jeremydboyd"
  },
  {
    name: "neuelane",
    email: "None",
    phone: "(305) 800-6383",
    address: "1399 SE 9th Ave #7, Hialeah, FL 33010",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://neuelane.com/"
  },
  {
    name: "Pacific54",
    email: "myteam@pacific54.com",
    phone: "(305) 515-5473",
    address: "2750 NW 3rd Ave #17, Miami, FL 33127",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://www.pacific54.com/"
  },
  {
    name: "White Shark Media",
    email: "info@whitesharkmedia.com",
    phone: "(786) 728-9004",
    address: "25 SW 9th St CU-7, Miami, FL 33131",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://www.whitesharkmedia.com/?utm_source=GBP&utm_medium=organic-traffic"
  },
  {
    name: "Smash Interactive Agency | Digital Marketing Agency Miami",
    email: "None",
    phone: "(786) 981-4758",
    address: "7400 SW 50th Terrace STE 205, Miami, FL 33155",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://smashinteractiveagency.com/?utm_campaign=gmb"
  },
  {
    name: "On The Map Marketing",
    email: "None",
    phone: "(305) 930-6221",
    address: "1 SE 3rd Ave Suite 2050, Miami, FL 33131",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://www.onthemap.com/miami-digital-marketing-agency?utm_source=gbp&utm_medium=organic&utm_campaign=miami"
  },
  {
    name: "Agency Marketing Machine",
    email: "support@ammteam.net",
    phone: "(786) 322-4999",
    address: "None",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://agencymarketingmachine.com/"
  },
  {
    name: "Kukic Advertising",
    email: "None",
    phone: "(305) 677-1621",
    address: "95 Merrick Wy Suite 300, Coral Gables, FL 33134",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "http://kukicadvertising.com/"
  },
  {
    name: "Heyday Marketing",
    email: "emoya@heydaymarketing.com",
    phone: "(305) 783-3407",
    address: "141 Sevilla Ave, Coral Gables, FL 33134",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://heydaymarketing.com/"
  },
  {
    name: "Suma Creative",
    email: "None",
    phone: "(305) 927-9440",
    address: "1101 Brickell Ave, Miami, FL 33131",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://bysuma.com/"
  },
  {
    name: "Trueba Media LLC | Miami Digital Marketing Agency",
    email: "Hello@TruebaMedia.com",
    phone: "(305) 239-7575",
    address: "66 W Flagler St Suit 900, Miami, FL 33130",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://www.truebamedia.com/"
  },
  {
    name: "iAnalyst",
    email: "info@ianalyst.com",
    phone: "(800) 270-1656",
    address: "117 NE 1st Ave unit 4-118, Miami, FL 33132",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "http://ianalyst.com/"
  },
  {
    name: "Brito Marketing | Advertising Agency | Agencia de Publicidad | AI Marketing",
    email: "None",
    phone: "(305) 384-1141",
    address: "6303 Waterford District Dr Suite 400 -2301, Miami, FL 33126",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "http://britomarketing.com/"
  },
  {
    name: "Absolute Marketing",
    email: "gagd171986@gmail.com",
    phone: "(561) 705-7721",
    address: "One Biscayne, 2 Biscayne Blvd Tower, floor 37, Miami, FL 33131",
    city: "Miami",
    state: "FL",
    country: "US",
    website: "https://absolutemarketing.io/"
  },
];
