import _get from "lodash/get";

/**
 * Calculators for new benefit and expiry values
 */

const benefitCalculators = {
  // Herbal Tea increases by 1. If it has expired, it increases by 2.
  "Herbal Tea": (oldBenefit, expiresIn) => {
    let delta = expiresIn <= 0 ? 2 : 1;
    return oldBenefit + delta;
  },

  // Magic pill never degrades
  "Magic Pill": oldBenefit => oldBenefit,

  // Fervex increases by 1. If it's within 10 days of expiry, it increases
  // by 2. If it's within 5 days of expiry, it increases by 3. If it expires, it's 0.
  Fervex: (oldBenefit, expiresIn) => {
    if (expiresIn <= 0) {
      return 0;
    }

    let delta = 1;
    if (expiresIn <= 5) {
      delta = 3;
    } else if (expiresIn <= 10) {
      delta = 2;
    }

    return oldBenefit + delta;
  },

  // Dafalgan decreases by 2
  Dafalgan: oldBenefit => oldBenefit - 2,

  // Everything else decreases by 1. If it's expired, it decreases by 2.
  _default: (oldBenefit, expiresIn) => {
    return expiresIn <= 0 ? oldBenefit - 2 : oldBenefit - 1;
  }
};

const expiryCalculators = {
  "Magic Pill": expiresIn => expiresIn,
  _default: expiresIn => expiresIn - 1
};

/**
 * Given a drug name, old benefit and expiresIn time, calculate the drug's new benefit
 * @return int
 */
export function calculateNewBenefit(drugName, oldBenefit, expiresIn) {
  const newBenefit = _get(
    benefitCalculators,
    drugName,
    benefitCalculators._default
  )(oldBenefit, expiresIn);

  return Math.max(0, Math.min(newBenefit, 50));
}

/**
 * Given a drug name and expiresIn time, calculate the drug's new expiresIn
 * @return int
 */
export function calculateNewExpiresIn(drugName, expiresIn) {
  return _get(expiryCalculators, drugName, expiryCalculators._default)(
    expiresIn
  );
}
