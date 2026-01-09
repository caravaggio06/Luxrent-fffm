import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

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

const carsCol = collection(db, "cars");

export async function fsListCars(): Promise<Car[]> {
  const q = query(carsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Car[];
}

export async function fsGetCar(id: string): Promise<Car | null> {
  const ref = doc(db, "cars", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as Car;
}

export async function fsUpsertCar(car: Car): Promise<void> {
  const ref = doc(db, "cars", car.id);
  await setDoc(ref, { ...car, createdAt: serverTimestamp() }, { merge: true });
}
