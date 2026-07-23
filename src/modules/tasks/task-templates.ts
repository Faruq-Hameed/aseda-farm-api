function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 86400000);
}
function addMonths(d: Date, months: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

function generatePlantainTasks(pd: Date, batchId: string, farmId: string) {
  return [
    { title: 'H0: Pre-emergence herbicide application', description: 'Apply Pendimethalin 330EC across all inter-row areas before weed germination. Rate: 3-4 L/ha diluted in 200-300L water. Keep away from sucker base.', category: 'herbicide', dueDate: addDays(pd, 10), priority: 'high', product: 'Pendimethalin 330EC (Stomp/Pendistar)', quantity: '1.2-1.6 L per acre', farmId, batchId },
    { title: 'Apply heavy mulching around all plants', description: 'Apply 5-8cm layer of dry grass or leaves around the base of each plant. Retains moisture, suppresses weeds.', category: 'other', dueDate: addDays(pd, 14), priority: 'high', product: 'Dry grass / leaves', quantity: 'Full coverage around each plant', farmId, batchId },
    { title: 'Apply poultry manure (Month 1)', description: 'Apply 2kg poultry manure per plant around the base in a ring 30cm from stem. Compensates for missed basal NPK at planting.', category: 'fertilizer', dueDate: addMonths(pd, 1), priority: 'medium', product: 'Poultry manure', quantity: '2kg per plant', farmId, batchId },
    { title: 'Farm inspection — establishment check', description: 'Walk every row. Check establishment rate, identify dead plants, check for weevil damage, assess mulch coverage.', category: 'inspection', dueDate: addDays(pd, 45), priority: 'medium', farmId, batchId },
    { title: 'F1: First top dress — NPK 15:15:15 (Month 2.5)', description: 'Apply NPK 15:15:15 in ring application 30-40cm from each stem. Do NOT touch stem. Apply to moist soil only. 250g per plant (compensated rate).', category: 'fertilizer', dueDate: addDays(pd, 75), priority: 'high', product: 'NPK 15:15:15', quantity: '250g per plant (170kg total = 3.5 bags of 50kg)', farmId, batchId },
    { title: 'H1: Post-emergence herbicide (same week as F1)', description: 'Apply Paraquat 200SL directed spray BETWEEN rows only. Maintain 50cm+ distance from plantain stem. Manual weed within 30cm of stem.', category: 'herbicide', dueDate: addDays(pd, 77), priority: 'high', product: 'Paraquat 200SL (Gramoxone)', quantity: '2-3 L/ha directed', farmId, batchId },
    { title: 'Apply wood ash to all plants (Month 3)', description: 'Apply generous handful of wood ash from kitchen fire around each plant. Free source of potassium.', category: 'fertilizer', dueDate: addMonths(pd, 3), priority: 'low', product: 'Wood ash', quantity: 'Large handful per plant', farmId, batchId },
    { title: 'Banana weevil inspection and trapping', description: 'Set pseudo-stem traps near base (1 trap per 20-30 plants). Check daily for 1 week, kill any adult weevils found.', category: 'pest_control', dueDate: addMonths(pd, 3), priority: 'medium', farmId, batchId },
    { title: 'Sucker count and management check (Month 4)', description: 'Walk every mat. Count sword suckers. Remove all water suckers. Leave maximum 2 sword suckers per mat.', category: 'inspection', dueDate: addMonths(pd, 4), priority: 'medium', farmId, batchId },
    { title: 'F2: Pre-flowering fertilizer — NPK 12:12:17 (Month 5) — CRITICAL', description: 'SWITCH to high-potassium NPK 12:12:17. Apply in ring 40-50cm from stem. Drives flower bud formation — do not skip or delay.', category: 'fertilizer', dueDate: addMonths(pd, 5), priority: 'critical', product: 'NPK 12:12:17', quantity: '200g per plant (136kg total = 3 bags of 50kg)', farmId, batchId },
    { title: 'H2: Post-emergence herbicide (same week as F2)', description: 'Apply Paraquat 200SL directed between rows. Protect nutrient uptake from F2 application.', category: 'herbicide', dueDate: addDays(addMonths(pd, 5), 2), priority: 'high', product: 'Paraquat 200SL or 2,4-D Amine 720SL', quantity: '2-3 L/ha directed', farmId, batchId },
    { title: 'SUCKER HARVEST — collect 60-90cm sword suckers (Month 6)', description: 'Begin harvesting sword suckers that have reached 60-90cm. Leave 1 ratoon per mat. Cut with piece of mother corm attached. Replant within 24-48 hours.', category: 'sucker_harvest', dueDate: addMonths(pd, 6), priority: 'high', farmId, batchId },
    { title: 'F3: Bunch filling fertilizer — NPK 12:12:17 + MOP (Month 7) — NON-NEGOTIABLE', description: 'Most critical application. Apply NPK 12:12:17 (250g) + Muriate of Potash MOP (50g) per plant. Accounts for 40-50% of final bunch weight.', category: 'fertilizer', dueDate: addMonths(pd, 7), priority: 'critical', product: 'NPK 12:12:17 + Muriate of Potash (MOP)', quantity: '250g NPK 12:12:17 + 50g MOP per plant', farmId, batchId },
    { title: 'H3: Post-emergence herbicide (Month 7)', description: 'Apply Paraquat 200SL directed between rows same week as F3. Extra care near mats beginning to flower.', category: 'herbicide', dueDate: addDays(addMonths(pd, 7), 2), priority: 'high', product: 'Paraquat 200SL', quantity: '2-3 L/ha directed', farmId, batchId },
    { title: 'BEGIN PROPPING — support bunch-bearing plants (Month 8)', description: 'Start propping as bunches develop. Use bamboo poles 1.8-2.5m long at 45-degree angle on opposite side from bunch.', category: 'propping', dueDate: addMonths(pd, 8), priority: 'high', product: 'Bamboo poles or hardwood sticks', quantity: '1 pole per bunch-bearing plant', farmId, batchId },
    { title: 'Begin flowering monitoring and harvest countdown (Month 8)', description: 'Walk farm daily. When a bunch flower emerges, record the date. Count 90-120 days from flower emergence to harvest readiness.', category: 'inspection', dueDate: addMonths(pd, 8), priority: 'high', farmId, batchId },
    { title: 'Dry season management — mulching and monitoring (Month 9)', description: 'Dry season begins. No herbicide needed. Manual weed only. Mulch heavily. Monitor flowering and bunch development.', category: 'other', dueDate: addMonths(pd, 9), priority: 'medium', farmId, batchId },
    { title: 'Pre-harvest marketing — contact buyers (Month 10)', description: 'Contact Bodija Market dealers and restaurant/buka contacts on Olojuoro axis. Aim for 40% Bodija, 30% restaurant, 30% farm gate.', category: 'other', dueDate: addMonths(pd, 10), priority: 'high', farmId, batchId },
    { title: 'H4: Pre-harvest herbicide — clear farm for access (Month 11)', description: 'Apply Paraquat 200SL directed between rows. Clear access paths for harvest team and buyers.', category: 'herbicide', dueDate: addMonths(pd, 11), priority: 'medium', product: 'Paraquat 200SL', quantity: '2-3 L/ha directed', farmId, batchId },
    { title: 'FIRST HARVEST begins — stagger over 8-10 weeks', description: 'Begin harvesting bunches as they reach maturity (90-120 days from flower). Do NOT harvest all at once. Stagger over 8-10 weeks.', category: 'bunch_harvest', dueDate: addMonths(pd, 12), priority: 'critical', farmId, batchId },
    { title: 'F4: Ratoon fertilizer — NPK 15:15:15 (post each harvest)', description: 'Apply 150g NPK 15:15:15 per mat within 2-4 weeks of cutting each bunch. Feed each mat right after its harvest.', category: 'fertilizer', dueDate: addDays(addMonths(pd, 12), 21), priority: 'high', product: 'NPK 15:15:15', quantity: '150g per harvested mat (102kg total = 2 bags)', farmId, batchId },
    { title: 'CORM GOUGING — immediately after each bunch harvest', description: 'Gouge harvested mats IMMEDIATELY after bunch is cut: (1) Cut pseudostem to 30-45cm, (2) Expose corm crown, (3) Gouge central bud 5-8cm deep, (4) Pack hole with wood ash, (5) Mulch and keep moist.', category: 'gouging', dueDate: addDays(addMonths(pd, 12), 7), priority: 'critical', farmId, batchId },
  ];
}

function generateMaizeTasks(pd: Date, batchId: string, farmId: string) {
  return [
    { title: 'Land preparation — plough, harrow and ridge', description: 'Plough and harrow to a fine tilth, then ridge or mark rows at 75cm apart. Clear all previous crop residue.', category: 'land_prep', dueDate: pd, priority: 'high', farmId, batchId },
    { title: 'Planting — sow seeds', description: 'Sow 2 seeds per hole at 25cm within-row spacing, 3-5cm deep. Thin to 1 healthy plant per stand at 2 weeks.', category: 'planting', dueDate: addDays(pd, 3), priority: 'critical', product: 'Improved maize seed (Oba Super 2 / Sammaz)', quantity: '2 seeds per hole', farmId, batchId },
    { title: 'Basal fertilizer application', description: 'Apply NPK 15:15:15 in bands 5cm to the side and 5cm below the seed at planting, or within 1 week after.', category: 'fertilizer', dueDate: addDays(pd, 3), priority: 'high', product: 'NPK 15:15:15', quantity: '1 bag (50kg) per acre', farmId, batchId },
    { title: 'Pre-emergence herbicide', description: 'Apply Primextra (Atrazine + Metolachlor) to the soil surface immediately after planting, before weeds or maize emerge.', category: 'herbicide', dueDate: addDays(pd, 4), priority: 'high', product: 'Primextra Gold 720SC', quantity: '2.5-3 L/ha', farmId, batchId },
    { title: 'Germination and stand count check', description: 'Walk every row at 2 weeks. Count established stands, gap-fill any failed spots with pre-soaked seed.', category: 'inspection', dueDate: addDays(pd, 14), priority: 'medium', farmId, batchId },
    { title: 'First weeding', description: 'Manual hoe-weeding or directed herbicide between rows. Keep base of plants weed-free — early competition cuts yield sharply.', category: 'weeding', dueDate: addDays(pd, 21), priority: 'high', farmId, batchId },
    { title: 'Fall armyworm scouting and control', description: 'Inspect whorls for windowpane feeding damage and frass. If more than 1 in 5 plants infested, apply Emamectin benzoate or Lambda-cyhalothrin directed into the whorl.', category: 'pest_control', dueDate: addDays(pd, 25), priority: 'critical', product: 'Emamectin benzoate 5SG or Lambda-cyhalothrin', quantity: 'As per label rate', farmId, batchId },
    { title: 'Urea top-dress — CRITICAL', description: 'Apply Urea before tasseling, while soil is moist. This drives cob size and is the single most yield-critical application.', category: 'fertilizer', dueDate: addDays(pd, 35), priority: 'critical', product: 'Urea (46% N)', quantity: '1 bag (50kg) per acre', farmId, batchId },
    { title: 'Second weeding and earthing up', description: 'Final weeding before canopy closes. Earth up soil around the base to support the plant and cover surface roots.', category: 'weeding', dueDate: addDays(pd, 42), priority: 'medium', farmId, batchId },
    { title: 'Tasseling and silking monitoring', description: 'Confirm tasseling and silk emergence across the field — this is the window that sets final cob count. Continue armyworm checks.', category: 'inspection', dueDate: addDays(pd, 60), priority: 'high', farmId, batchId },
    { title: 'Stem borer and ear rot monitoring', description: 'Check stems for boring holes and developing cobs for rot, especially after heavy rain.', category: 'pest_control', dueDate: addDays(pd, 75), priority: 'medium', farmId, batchId },
    { title: 'Maturity check', description: 'Check for browning husks and black layer formation at the kernel base — signals physiological maturity.', category: 'inspection', dueDate: addDays(pd, 100), priority: 'medium', farmId, batchId },
    { title: 'HARVEST — dry grain maize', description: 'Harvest when husks are dry and brown and grain is hard. Dehusk in the field where possible.', category: 'harvest', dueDate: addDays(pd, 112), priority: 'critical', farmId, batchId },
    { title: 'Drying, shelling and storage', description: 'Sun-dry cobs to below 13% moisture before shelling. Store shelled grain in weevil-proof bags with a preservative (e.g. Actellic dust).', category: 'other', dueDate: addDays(pd, 118), priority: 'high', farmId, batchId },
  ];
}

function generateSweetPotatoTasks(pd: Date, batchId: string, farmId: string) {
  return [
    { title: 'Land preparation — ridging', description: 'Plough and form ridges 1m apart, at least 30cm high. Sweet potato needs loose, well-drained soil for tuber expansion.', category: 'land_prep', dueDate: pd, priority: 'high', farmId, batchId },
    { title: 'Planting — vine cuttings', description: 'Plant healthy vine cuttings (25-30cm, 3-4 nodes) at 30cm spacing along the ridge, slanted with 2 nodes buried.', category: 'planting', dueDate: addDays(pd, 2), priority: 'critical', product: 'Sweet potato vine cuttings (TIS 87/0087 or similar)', quantity: '25-30cm cuttings, 30cm apart', farmId, batchId },
    { title: 'Gap-filling check', description: 'Walk every ridge. Replace any cuttings that failed to establish with fresh vine material.', category: 'inspection', dueDate: addDays(pd, 10), priority: 'medium', farmId, batchId },
    { title: 'First weeding', description: 'Weed by hand or hoe while vines are still short — this is the critical window before vines cover the ridge and suppress weeds themselves.', category: 'weeding', dueDate: addDays(pd, 21), priority: 'high', farmId, batchId },
    { title: 'Light basal fertilizer application', description: 'Apply a light dose of low-nitrogen NPK. Avoid heavy nitrogen — it pushes vine growth at the expense of tuber formation.', category: 'fertilizer', dueDate: addDays(pd, 25), priority: 'medium', product: 'NPK 15:15:15 (light rate)', quantity: '1/2 bag (25kg) per acre', farmId, batchId },
    { title: 'Sweet potato weevil monitoring', description: 'Set pheromone traps and inspect ridge cracks for weevil entry points. Weevil damage is the single biggest cause of crop loss.', category: 'pest_control', dueDate: addDays(pd, 35), priority: 'high', farmId, batchId },
    { title: 'Second weeding and ridge maintenance', description: 'Weed again and re-firm ridges, covering any tubers that have cracked through the surface — exposed tubers turn green and attract weevils.', category: 'weeding', dueDate: addDays(pd, 42), priority: 'high', farmId, batchId },
    { title: 'Vine lifting', description: 'Gently lift and turn trailing vines so they stop rooting at the nodes, which diverts energy away from the main tubers.', category: 'other', dueDate: addDays(pd, 50), priority: 'medium', farmId, batchId },
    { title: 'Potassium top-dress for tuber bulking', description: 'Apply Muriate of Potash (MOP) to support tuber bulking — the main growth phase from here to harvest.', category: 'fertilizer', dueDate: addDays(pd, 60), priority: 'high', product: 'Muriate of Potash (MOP)', quantity: '1/2 bag (25kg) per acre', farmId, batchId },
    { title: 'Continued weevil control', description: 'Re-check traps and ridge cracks. Weevil pressure rises as tubers approach maturity and soil dries around them.', category: 'pest_control', dueDate: addDays(pd, 75), priority: 'high', farmId, batchId },
    { title: 'Pre-harvest maturity check', description: 'Sample-dig a few plants to check tuber size and skin set before committing to full harvest.', category: 'inspection', dueDate: addDays(pd, 90), priority: 'medium', farmId, batchId },
    { title: 'HARVEST', description: 'Harvest by carefully digging to avoid cutting or bruising tubers — damaged tubers rot quickly in storage.', category: 'harvest', dueDate: addDays(pd, 105), priority: 'critical', farmId, batchId },
    { title: 'Curing and storage', description: 'Cure tubers at warm temperature and high humidity for 4-7 days to heal cuts before storage — significantly extends shelf life.', category: 'other', dueDate: addDays(pd, 108), priority: 'medium', farmId, batchId },
  ];
}

function generateCassavaTasks(pd: Date, batchId: string, farmId: string) {
  return [
    { title: 'Land preparation — ridging/mounding', description: 'Plough and form ridges or mounds at 1m x 1m spacing. Good drainage is essential — cassava roots rot in waterlogged soil.', category: 'land_prep', dueDate: pd, priority: 'high', farmId, batchId },
    { title: 'Planting — stem cuttings', description: 'Plant healthy, disease-free stem cuttings (20-25cm, 5-6 nodes) at a 45-degree angle, 2/3 buried in the ridge top.', category: 'planting', dueDate: addDays(pd, 3), priority: 'critical', product: 'Cassava stem cuttings (TME 419 or similar)', quantity: '20-25cm cuttings, 1m x 1m spacing', farmId, batchId },
    { title: 'Sprouting check and gap-filling', description: 'Walk the plot at 2 weeks. Replace any cuttings that failed to sprout.', category: 'inspection', dueDate: addDays(pd, 14), priority: 'medium', farmId, batchId },
    { title: 'First weeding — CRITICAL', description: 'Cassava is a poor early competitor. Weed thoroughly in month 1 — this single weeding has the largest impact on final yield.', category: 'weeding', dueDate: addMonths(pd, 1), priority: 'critical', farmId, batchId },
    { title: 'Cassava mosaic disease inspection', description: 'Check leaves for mosaic mottling and distortion. Uproot and destroy visibly infected plants to stop spread.', category: 'pest_control', dueDate: addDays(addMonths(pd, 1), 15), priority: 'high', farmId, batchId },
    { title: 'Basal fertilizer application', description: 'Apply NPK 15:15:15 in a ring around each plant, avoiding direct stem contact.', category: 'fertilizer', dueDate: addMonths(pd, 2), priority: 'medium', product: 'NPK 15:15:15', quantity: '1 bag (50kg) per acre', farmId, batchId },
    { title: 'Second weeding', description: 'Weed again before canopy closure. Growth accelerates from here as the canopy starts to shade out weeds naturally.', category: 'weeding', dueDate: addDays(addMonths(pd, 2), 15), priority: 'high', farmId, batchId },
    { title: 'Earthing up / ridge maintenance', description: 'Re-firm ridges around the base of each plant to support root development and prevent lodging.', category: 'other', dueDate: addMonths(pd, 3), priority: 'medium', farmId, batchId },
    { title: 'Third weeding', description: 'Final weeding pass. By now canopy closure should largely suppress new weed growth.', category: 'weeding', dueDate: addDays(addMonths(pd, 3), 15), priority: 'medium', farmId, batchId },
    { title: 'Potassium top-dress for root bulking', description: 'Apply Muriate of Potash to support the root-bulking phase, which continues for the rest of the cycle.', category: 'fertilizer', dueDate: addMonths(pd, 4), priority: 'high', product: 'Muriate of Potash (MOP)', quantity: '1/2 bag (25kg) per acre', farmId, batchId },
    { title: 'Mealybug and green mite monitoring', description: 'Inspect shoot tips and leaf undersides, especially in the dry season when mite pressure rises.', category: 'pest_control', dueDate: addMonths(pd, 5), priority: 'medium', farmId, batchId },
    { title: 'Growth and canopy inspection', description: 'General walk-through to assess canopy health, plant vigour and any lodging or disease pressure.', category: 'inspection', dueDate: addMonths(pd, 6), priority: 'low', farmId, batchId },
    { title: 'Pre-harvest sample check', description: 'Dig a few sample plants to assess root size and starch content before committing to full harvest.', category: 'inspection', dueDate: addMonths(pd, 8), priority: 'medium', farmId, batchId },
    { title: 'HARVEST WINDOW OPENS', description: 'Begin staggered harvest as roots reach usable size — cassava can stay in the ground and be harvested as needed from this point.', category: 'harvest', dueDate: addMonths(pd, 9), priority: 'high', farmId, batchId },
    { title: 'Continue staggered harvest', description: 'Coordinate harvest with buyers/processors — roots deteriorate within 48-72 hours of being dug, so harvest close to sale or processing.', category: 'harvest', dueDate: addMonths(pd, 10), priority: 'medium', farmId, batchId },
    { title: 'Final harvest', description: 'Harvest remaining plants before roots become overly fibrous and lignified from over-maturity.', category: 'harvest', dueDate: addMonths(pd, 11), priority: 'high', farmId, batchId },
  ];
}

function generateCocoyamTasks(pd: Date, batchId: string, farmId: string) {
  return [
    { title: 'Land preparation', description: 'Clear and loosen soil to a fine tilth. Cocoyam prefers moist, fertile, well-drained soil — avoid waterlogged sites.', category: 'land_prep', dueDate: pd, priority: 'high', farmId, batchId },
    { title: 'Planting — cormels/setts', description: 'Plant healthy cormels or top-setts 5-8cm deep at 1m x 1m spacing.', category: 'planting', dueDate: addDays(pd, 3), priority: 'critical', product: 'Cocoyam cormels/setts', quantity: '1m x 1m spacing', farmId, batchId },
    { title: 'Mulching', description: 'Apply mulch around plants to retain the consistent soil moisture cocoyam needs to establish well.', category: 'other', dueDate: addDays(pd, 14), priority: 'high', product: 'Dry grass / leaves', quantity: 'Full coverage around each plant', farmId, batchId },
    { title: 'Germination check and gap-filling', description: 'Walk the plot at 3 weeks. Replace any setts that failed to sprout.', category: 'inspection', dueDate: addDays(pd, 21), priority: 'medium', farmId, batchId },
    { title: 'First weeding', description: 'Weed by hand, keeping the mulch layer intact where possible.', category: 'weeding', dueDate: addMonths(pd, 1), priority: 'high', farmId, batchId },
    { title: 'Organic fertilizer application', description: 'Apply poultry manure or well-rotted compost around the base of each plant.', category: 'fertilizer', dueDate: addDays(addMonths(pd, 1), 15), priority: 'medium', product: 'Poultry manure / compost', quantity: '1-2kg per plant', farmId, batchId },
    { title: 'Leaf blight inspection', description: 'Check leaves for water-soaked lesions that turn brown (Phytophthora leaf blight). Remove and destroy infected leaves promptly, especially in wet weather.', category: 'pest_control', dueDate: addMonths(pd, 2), priority: 'high', farmId, batchId },
    { title: 'Second weeding', description: 'Weed again and re-mulch as needed to keep soil moisture consistent.', category: 'weeding', dueDate: addDays(addMonths(pd, 2), 15), priority: 'medium', farmId, batchId },
    { title: 'NPK fertilizer top-dress', description: 'Apply NPK 15:15:15 in a ring around each plant to support vegetative growth.', category: 'fertilizer', dueDate: addMonths(pd, 3), priority: 'medium', product: 'NPK 15:15:15', quantity: '1 bag (50kg) per acre', farmId, batchId },
    { title: 'Continued leaf blight monitoring', description: 'Leaf blight pressure peaks in the rainy season — keep checking and removing infected foliage.', category: 'pest_control', dueDate: addMonths(pd, 4), priority: 'medium', farmId, batchId },
    { title: 'Re-mulch and weed as needed', description: 'Top up mulch and clear any regrowth before the canopy fully closes.', category: 'weeding', dueDate: addMonths(pd, 5), priority: 'low', farmId, batchId },
    { title: 'Potassium application for corm bulking', description: 'Apply Muriate of Potash to support corm bulking through to harvest.', category: 'fertilizer', dueDate: addMonths(pd, 6), priority: 'high', product: 'Muriate of Potash (MOP)', quantity: '1/2 bag (25kg) per acre', farmId, batchId },
    { title: 'Pre-harvest sample check', description: 'Dig a few sample plants to check corm size before committing to full harvest.', category: 'inspection', dueDate: addMonths(pd, 8), priority: 'medium', farmId, batchId },
    { title: 'HARVEST begins', description: 'Begin harvesting as corms reach maturity — leaves yellowing and drying back is the usual sign.', category: 'harvest', dueDate: addMonths(pd, 9), priority: 'critical', farmId, batchId },
    { title: 'Complete harvest', description: 'Finish harvesting before corms sit too long and become fibrous.', category: 'harvest', dueDate: addMonths(pd, 10), priority: 'high', farmId, batchId },
  ];
}

const GENERATORS: Record<string, (pd: Date, batchId: string, farmId: string) => ReturnType<typeof generatePlantainTasks>> = {
  plantain: generatePlantainTasks,
  maize: generateMaizeTasks,
  sweet_potato: generateSweetPotatoTasks,
  cassava: generateCassavaTasks,
  cocoyam: generateCocoyamTasks,
};

export function generateTasksForBatch(cropType: string, plantingDate: Date, batchId: string, farmId: string) {
  const generator = GENERATORS[cropType] || generatePlantainTasks;
  return generator(new Date(plantingDate), batchId, farmId);
}
