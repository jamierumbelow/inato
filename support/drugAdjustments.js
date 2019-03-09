const benefitCalculators = {
  "Herbal Tea": (oldBenefit, expiresIn) => {
    let delta = 1;
    if (expiresIn <= 0) {
      delta = 2;
    }

    return Math.min(oldBenefit + delta, 50);
  },

  "Magic Pill": oldBenefit => oldBenefit,

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

    return Math.min(oldBenefit + delta, 50);
  },

  Dafalgan: oldBenefit => Math.max(oldBenefit - 2, 0)
};

const expiryCalculators = {
  "Magic Pill": expiresIn => expiresIn
};

/**
 * Given a drug name, old benefit and expiresIn time, calculate the drug's new benefit
 * @return int
 */
export function calculateNewBenefit(drugName, oldBenefit, expiresIn) {
  if (benefitCalculators[drugName]) {
    return benefitCalculators[drugName](oldBenefit, expiresIn);
  }

  let delta = 1;
  if (expiresIn <= 0) {
    delta = 2;
  }

  return Math.max(0, oldBenefit - delta);
}

/**
 * Given a drug name and expiresIn time, calculate the drug's new expiresIn
 * @return int
 */
export function calculateNewExpiresIn(drugName, expiresIn) {
  if (expiryCalculators[drugName]) {
    return expiryCalculators[drugName](expiresIn);
  }

  return expiresIn - 1;
}
