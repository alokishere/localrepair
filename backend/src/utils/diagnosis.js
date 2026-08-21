const DIAGNOSIS_RULES = {
  ac: {
    name: 'AC',
    problems: {
      'not cooling': { possibleIssues: ['Dirty air filter', 'Low refrigerant', 'Compressor problem'], estimatedCost: { min: 500, max: 2500 }, issue: 'Possible filter blockage or low refrigerant', urgency: 'MEDIUM' },
      'water leaking': { possibleIssues: ['Blocked drain pipe', 'Frozen evaporator coil', 'Loose drain connection'], estimatedCost: { min: 400, max: 1800 }, issue: 'Possible drainage blockage or coil issue', urgency: 'MEDIUM' },
      'making noise': { possibleIssues: ['Loose fan blade', 'Worn motor bearing', 'Debris in the indoor unit'], estimatedCost: { min: 300, max: 2200 }, issue: 'Possible fan or motor problem', urgency: 'MEDIUM' },
      'not turning on': { possibleIssues: ['Power supply issue', 'Faulty capacitor', 'Control board problem'], estimatedCost: { min: 350, max: 3000 }, issue: 'Possible electrical or control issue', urgency: 'HIGH' },
    },
  },
  refrigerator: {
    name: 'Refrigerator',
    problems: {
      'not cooling': { possibleIssues: ['Dirty condenser coils', 'Faulty thermostat', 'Compressor issue'], estimatedCost: { min: 600, max: 4000 }, issue: 'Possible cooling system or thermostat issue', urgency: 'HIGH' },
      'water leakage': { possibleIssues: ['Blocked defrost drain', 'Damaged door seal', 'Cracked drain pan'], estimatedCost: { min: 400, max: 2200 }, issue: 'Possible drain or seal problem', urgency: 'MEDIUM' },
      'making noise': { possibleIssues: ['Unbalanced compressor', 'Fan obstruction', 'Worn motor'], estimatedCost: { min: 400, max: 2800 }, issue: 'Possible fan or compressor problem', urgency: 'MEDIUM' },
      'not turning on': { possibleIssues: ['Power supply issue', 'Faulty relay', 'Control board problem'], estimatedCost: { min: 500, max: 3500 }, issue: 'Possible electrical or control issue', urgency: 'HIGH' },
    },
  },
  'washing-machine': {
    name: 'Washing Machine',
    problems: {
      'not starting': { possibleIssues: ['Door lock fault', 'Power supply issue', 'Control panel problem'], estimatedCost: { min: 350, max: 2500 }, issue: 'Possible door lock or control issue', urgency: 'MEDIUM' },
      'not draining': { possibleIssues: ['Blocked drain filter', 'Kinked drain hose', 'Drain pump problem'], estimatedCost: { min: 300, max: 1800 }, issue: 'Possible drain blockage or pump issue', urgency: 'MEDIUM' },
      'not spinning': { possibleIssues: ['Unbalanced load', 'Worn drive belt', 'Motor coupling problem'], estimatedCost: { min: 400, max: 2600 }, issue: 'Possible belt or motor problem', urgency: 'MEDIUM' },
      'excessive vibration': { possibleIssues: ['Uneven floor', 'Unbalanced drum', 'Worn suspension rods'], estimatedCost: { min: 300, max: 2400 }, issue: 'Possible leveling or suspension issue', urgency: 'MEDIUM' },
    },
  },
  tv: {
    name: 'TV',
    problems: {
      'no display': { possibleIssues: ['Loose HDMI connection', 'Backlight failure', 'Display panel issue'], estimatedCost: { min: 300, max: 8000 }, issue: 'Possible connection, backlight, or panel issue', urgency: 'MEDIUM' },
      'no sound': { possibleIssues: ['Muted audio output', 'Speaker failure', 'Audio board issue'], estimatedCost: { min: 250, max: 3500 }, issue: 'Possible audio setting or speaker issue', urgency: 'LOW' },
      'not turning on': { possibleIssues: ['Power supply issue', 'Faulty remote or button', 'Main board problem'], estimatedCost: { min: 300, max: 5000 }, issue: 'Possible power or main board issue', urgency: 'HIGH' },
      'screen flickering': { possibleIssues: ['Loose display connection', 'Backlight instability', 'Panel fault'], estimatedCost: { min: 500, max: 6500 }, issue: 'Possible display connection or panel issue', urgency: 'MEDIUM' },
    },
  },
  'water-purifier': {
    name: 'RO',
    problems: {
      'not filtering': { possibleIssues: ['Expired filter cartridge', 'Membrane blockage', 'Low inlet pressure'], estimatedCost: { min: 400, max: 2500 }, issue: 'Possible filter or membrane issue', urgency: 'MEDIUM' },
      'low water flow': { possibleIssues: ['Clogged pre-filter', 'Low water pressure', 'Kinked tube'], estimatedCost: { min: 300, max: 1800 }, issue: 'Possible flow restriction or pressure issue', urgency: 'MEDIUM' },
      'water leakage': { possibleIssues: ['Loose tube connection', 'Damaged filter housing', 'Faulty valve'], estimatedCost: { min: 250, max: 1600 }, issue: 'Possible connection or valve leak', urgency: 'MEDIUM' },
      'not turning on': { possibleIssues: ['Power adapter issue', 'Faulty pump', 'Control board problem'], estimatedCost: { min: 350, max: 2200 }, issue: 'Possible power or pump issue', urgency: 'HIGH' },
    },
  },
  microwave: {
    name: 'Microwave',
    problems: {
      'not heating': { possibleIssues: ['Faulty magnetron', 'Door switch issue', 'High-voltage diode failure'], estimatedCost: { min: 700, max: 3500 }, issue: 'Possible heating circuit or door switch issue', urgency: 'HIGH' },
      'not turning on': { possibleIssues: ['Power supply issue', 'Door interlock fault', 'Control board problem'], estimatedCost: { min: 350, max: 2800 }, issue: 'Possible power or door interlock issue', urgency: 'HIGH' },
      'making noise': { possibleIssues: ['Turntable motor issue', 'Cooling fan obstruction', 'Magnetron noise'], estimatedCost: { min: 300, max: 2500 }, issue: 'Possible motor, fan, or magnetron issue', urgency: 'MEDIUM' },
      'sparking': { possibleIssues: ['Metal object inside', 'Damaged waveguide cover', 'Interior paint damage'], estimatedCost: { min: 250, max: 1800 }, issue: 'Possible interior or waveguide issue', urgency: 'HIGH' },
    },
  },
};

const aliases = { ro: 'water-purifier', 'water purifier': 'water-purifier', 'washing machine': 'washing-machine' };

function normalizeAppliance(value) {
  if (typeof value !== 'string') return null;
  const key = value.trim().toLowerCase();
  return DIAGNOSIS_RULES[key] ? key : aliases[key] || null;
}

function normalizeProblem(value) {
  if (typeof value !== 'string') return null;
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getDiagnosis(appliance, problem) {
  const applianceKey = normalizeAppliance(appliance);
  const problemKey = normalizeProblem(problem);
  const rule = applianceKey && problemKey ? DIAGNOSIS_RULES[applianceKey]?.problems[problemKey] : null;
  if (!rule) return null;
  return { appliance: DIAGNOSIS_RULES[applianceKey].name, problem: problem.trim(), ...rule, nextStep: 'A technician should inspect the appliance', disclaimer: 'This is a suggestion; the technician confirms the diagnosis.' };
}

function supportedProblems(appliance) {
  const key = normalizeAppliance(appliance);
  return key ? Object.keys(DIAGNOSIS_RULES[key].problems) : [];
}

module.exports = { DIAGNOSIS_RULES, normalizeAppliance, getDiagnosis, supportedProblems };
