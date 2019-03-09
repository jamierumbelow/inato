import {
  calculateNewBenefit,
  calculateNewExpiresIn
} from "./support/drugAdjustments";

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  updateBenefitValue() {
    this.drugs = this.drugs.map(drug => {
      drug.benefit = calculateNewBenefit(
        drug.name,
        drug.benefit,
        drug.expiresIn
      );
      drug.expiresIn = calculateNewExpiresIn(drug.name, drug.expiresIn);

      return drug;
    });

    return this.drugs;
  }
}
