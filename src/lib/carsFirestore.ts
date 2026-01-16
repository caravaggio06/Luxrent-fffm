export type Car = {
  id: string;
  brand: string;
  model: string;
  year: number;
  dailyPrice: number;
  weekendPrice: number;
  deposit: number;
  powerHp: number;
  accel0to100: number;
  topspeedKmh: number;
  consumptionL100: number;
  drivetrain: string;
  gearbox: string;
  media: { poster?: string; video?: string; audio?: string };
};

export async function fsListCars(): Promise<Car[]> {
  throw new Error("Firestore wurde entfernt. Bitte Strapi verwenden.");
}

export async function fsGetCar(_id: string): Promise<Car | null> {
  throw new Error("Firestore wurde entfernt. Bitte Strapi verwenden.");
}

export async function fsUpsertCar(_car: Car): Promise<void> {
  throw new Error("Firestore wurde entfernt. Bitte Strapi verwenden.");
}
