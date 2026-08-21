const mongoose = require('mongoose');
const { Category } = require('../models');
const { getDiagnosis, supportedProblems } = require('../utils/diagnosis');

function badRequest(message, details = []) { const error = new Error(message); error.statusCode = 400; error.details = details; return error; }

async function diagnose(req, res, next) {
  try {
    const { appliance, problem, categoryId, problemDescription } = req.body || {};
    let applianceValue = appliance;
    if (!applianceValue && categoryId) {
      if (!mongoose.isValidObjectId(categoryId)) throw badRequest('Invalid categoryId', [{ field: 'categoryId', message: 'categoryId must be a valid id' }]);
      const category = await Category.findOne({ _id: categoryId, isActive: true }).select('slug name').lean();
      if (!category) throw badRequest('Unsupported appliance or problem');
      applianceValue = category.slug;
    }
    const problemValue = problem || problemDescription;
    if (!applianceValue || !problemValue) throw badRequest('Appliance and problem are required', [{ field: !applianceValue ? 'appliance' : 'problem', message: 'Select an appliance and describe the problem' }]);
    const diagnosis = getDiagnosis(applianceValue, problemValue);
    if (!diagnosis) throw badRequest('Unsupported appliance or problem', [{ field: 'problem', message: `Supported problems: ${supportedProblems(applianceValue).join(', ') || 'none'}` }]);
    return res.json({ success: true, message: 'Diagnosis suggestion generated', data: diagnosis });
  } catch (error) { return next(error); }
}

module.exports = { diagnose };
