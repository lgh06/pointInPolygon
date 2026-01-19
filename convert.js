import pds_tdt from './json/pingdingshan_tianditu.json' with { type: "json" };
import { wgs_gcj_encrypts } from './convertTool.js';
import fs from 'fs';

let converted = wgs_gcj_encrypts(pds_tdt);

fs.writeFileSync('./json/pingdingshan_gcj.json', JSON.stringify(converted, null, 2));

//  (\d+)\.(\d{6})(\d*)  $1.$2  保留6位小数