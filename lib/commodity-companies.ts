import type { CommodityType } from '@/types';

export interface CompanyTemplate {
  name: string;
  domain: string;
  type: string;
  region: string;
}

export const COMMODITY_COMPANIES: Record<CommodityType, CompanyTemplate[]> = {
  edible_oils: [
    { name: 'Cargill', domain: 'cargill.com', type: 'Trading Company', region: 'Americas' },
    { name: 'Bunge', domain: 'bunge.com', type: 'Trading Company', region: 'Americas' },
    { name: 'Wilmar International', domain: 'wilmar-international.com', type: 'Trading Company', region: 'Asia' },
    { name: 'Louis Dreyfus Company', domain: 'ldc.com', type: 'Trading Company', region: 'Europe' },
    { name: 'Archer Daniels Midland', domain: 'adm.com', type: 'Trading Company', region: 'Americas' },
    { name: 'Olam International', domain: 'olamgroup.com', type: 'Trading Company', region: 'Asia' },
    { name: 'Golden Agri-Resources', domain: 'goldenagri.com.sg', type: 'Producer', region: 'Asia' },
    { name: 'IOI Corporation', domain: 'ioigroup.com', type: 'Producer', region: 'Asia' },
    { name: 'Sime Darby Plantation', domain: 'simedarbyplantation.com', type: 'Producer', region: 'Asia' },
    { name: 'Richardson International', domain: 'richardson.ca', type: 'Trading Company', region: 'Americas' },
  ],
  fuel_oil: [
    { name: 'Vitol', domain: 'vitol.com', type: 'Trading Company', region: 'Europe' },
    { name: 'Trafigura', domain: 'trafigura.com', type: 'Trading Company', region: 'Europe' },
    { name: 'Glencore', domain: 'glencore.com', type: 'Trading Company', region: 'Europe' },
    { name: 'Gunvor', domain: 'gunvorgroup.com', type: 'Trading Company', region: 'Europe' },
    { name: 'Mercuria Energy', domain: 'mercuria.com', type: 'Trading Company', region: 'Europe' },
    { name: 'BP', domain: 'bp.com', type: 'Oil Major', region: 'Europe' },
    { name: 'Shell', domain: 'shell.com', type: 'Oil Major', region: 'Europe' },
    { name: 'ExxonMobil', domain: 'exxonmobil.com', type: 'Oil Major', region: 'Americas' },
    { name: 'TotalEnergies', domain: 'totalenergies.com', type: 'Oil Major', region: 'Europe' },
    { name: 'Chevron', domain: 'chevron.com', type: 'Oil Major', region: 'Americas' },
  ],
  gold: [
    { name: 'Barrick Gold', domain: 'barrick.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Newmont Corporation', domain: 'newmont.com', type: 'Mining Company', region: 'Americas' },
    { name: 'AngloGold Ashanti', domain: 'anglogoldashanti.com', type: 'Mining Company', region: 'Africa' },
    { name: 'Kinross Gold', domain: 'kinross.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Gold Fields', domain: 'goldfields.com', type: 'Mining Company', region: 'Africa' },
    { name: 'Newcrest Mining', domain: 'newcrest.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Agnico Eagle Mines', domain: 'agnicoeagle.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Polyus', domain: 'polyus.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Zijin Mining', domain: 'zijinmining.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Yamana Gold', domain: 'yamana.com', type: 'Mining Company', region: 'Americas' },
  ],
  steam_coal: [
    { name: 'Glencore', domain: 'glencore.com', type: 'Trading Company', region: 'Europe' },
    { name: 'BHP', domain: 'bhp.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Rio Tinto', domain: 'riotinto.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Anglo American', domain: 'angloamerican.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Peabody Energy', domain: 'peabodyenergy.com', type: 'Mining Company', region: 'Americas' },
    { name: 'China Shenhua Energy', domain: 'csec.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Adaro Energy', domain: 'adaro.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Yancoal', domain: 'yancoal.com.au', type: 'Mining Company', region: 'Asia' },
    { name: 'Whitehaven Coal', domain: 'whitehavencoal.com.au', type: 'Mining Company', region: 'Asia' },
    { name: 'Arch Resources', domain: 'archrsc.com', type: 'Mining Company', region: 'Americas' },
  ],
  anthracite_coal: [
    { name: 'Glencore', domain: 'glencore.com', type: 'Trading Company', region: 'Europe' },
    { name: 'BHP', domain: 'bhp.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Anglo American', domain: 'angloamerican.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Peabody Energy', domain: 'peabodyenergy.com', type: 'Mining Company', region: 'Americas' },
    { name: 'China Coal Energy', domain: 'chinacoal.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Mechel', domain: 'mechel.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Evraz', domain: 'evraz.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Shanxi Coking Coal', domain: 'sxcoal.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Arch Resources', domain: 'archrsc.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Consol Energy', domain: 'consolenergy.com', type: 'Mining Company', region: 'Americas' },
  ],
  urea: [
    { name: 'CF Industries', domain: 'cfindustries.com', type: 'Producer', region: 'Americas' },
    { name: 'Yara International', domain: 'yara.com', type: 'Producer', region: 'Europe' },
    { name: 'Nutrien', domain: 'nutrien.com', type: 'Producer', region: 'Americas' },
    { name: 'OCI', domain: 'oci.nl', type: 'Producer', region: 'Europe' },
    { name: 'SABIC', domain: 'sabic.com', type: 'Producer', region: 'Middle East' },
    { name: 'EuroChem', domain: 'eurochem.com', type: 'Producer', region: 'Europe' },
    { name: 'PhosAgro', domain: 'phosagro.com', type: 'Producer', region: 'Europe' },
    { name: 'Mosaic Company', domain: 'mosaicco.com', type: 'Producer', region: 'Americas' },
    { name: 'Koch Fertilizer', domain: 'kochfertilizer.com', type: 'Producer', region: 'Americas' },
    { name: 'Qatar Fertiliser Company', domain: 'qafco.qa', type: 'Producer', region: 'Middle East' },
  ],
  bio_fuels: [
    { name: 'Neste', domain: 'neste.com', type: 'Producer', region: 'Europe' },
    { name: 'Renewable Energy Group', domain: 'regi.com', type: 'Producer', region: 'Americas' },
    { name: 'Archer Daniels Midland', domain: 'adm.com', type: 'Producer', region: 'Americas' },
    { name: 'Cargill', domain: 'cargill.com', type: 'Producer', region: 'Americas' },
    { name: 'POET', domain: 'poet.com', type: 'Producer', region: 'Americas' },
    { name: 'Valero Energy', domain: 'valero.com', type: 'Producer', region: 'Americas' },
    { name: 'Raízen', domain: 'raizen.com.br', type: 'Producer', region: 'Americas' },
    { name: 'Verbio', domain: 'verbio.de', type: 'Producer', region: 'Europe' },
    { name: 'Green Plains', domain: 'gpreinc.com', type: 'Producer', region: 'Americas' },
    { name: 'Darling Ingredients', domain: 'darlingii.com', type: 'Producer', region: 'Americas' },
  ],
  iron_ore: [
    { name: 'Vale', domain: 'vale.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Rio Tinto', domain: 'riotinto.com', type: 'Mining Company', region: 'Europe' },
    { name: 'BHP', domain: 'bhp.com', type: 'Mining Company', region: 'Asia' },
    { name: 'Fortescue Metals', domain: 'fmgl.com.au', type: 'Mining Company', region: 'Asia' },
    { name: 'Anglo American', domain: 'angloamerican.com', type: 'Mining Company', region: 'Europe' },
    { name: 'Glencore', domain: 'glencore.com', type: 'Trading Company', region: 'Europe' },
    { name: 'ArcelorMittal', domain: 'arcelormittal.com', type: 'Steel Producer', region: 'Europe' },
    { name: 'Cleveland-Cliffs', domain: 'clevelandcliffs.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Champion Iron', domain: 'championiron.com', type: 'Mining Company', region: 'Americas' },
    { name: 'Ferrexpo', domain: 'ferrexpo.com', type: 'Mining Company', region: 'Europe' },
  ],
};

export function getCompaniesForCommodity(commodity: CommodityType, count: number = 10): CompanyTemplate[] {
  const companies = COMMODITY_COMPANIES[commodity] || [];
  // Shuffle and return requested count
  const shuffled = [...companies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, companies.length));
}
