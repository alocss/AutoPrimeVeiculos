import { z } from "zod";

const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo").max(200),
  email: z.string().email("E-mail inválido").max(200),
  phone: z.string().regex(phoneRegex, "Telefone inválido, use (11) 99999-9999"),
  message: z.string().min(10, "Conte um pouco mais (mínimo 10 caracteres)").max(5000),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const financingFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo").max(200),
  cpf: z.string().regex(cpfRegex, "CPF inválido"),
  email: z.string().email("E-mail inválido").max(200),
  phone: z.string().regex(phoneRegex, "Telefone inválido, use (11) 99999-9999"),
  vehicleInterest: z.string().min(2, "Informe o veículo de interesse").max(200),
  downPayment: z.coerce.number().min(0, "Informe um valor de entrada válido").max(100_000_000),
  termMonths: z.coerce.number().min(12).max(60),
});
export type FinancingFormValues = z.infer<typeof financingFormSchema>;

export const sellFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo").max(200),
  email: z.string().email("E-mail inválido").max(200),
  phone: z.string().regex(phoneRegex, "Telefone inválido, use (11) 99999-9999"),
  brand: z.string().min(1, "Selecione a marca").max(100),
  model: z.string().min(1, "Informe o modelo").max(100),
  year: z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
  km: z.coerce.number().min(0, "Informe a quilometragem").max(2_000_000),
  condition: z.enum(["EXCELENTE", "BOM", "REGULAR"], {
    errorMap: () => ({ message: "Selecione o estado de conservação" }),
  }),
});
export type SellFormValues = z.infer<typeof sellFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email("E-mail inválido").max(200),
  password: z.string().min(1, "Informe a senha").max(200),
});
export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const vehicleFormSchema = z.object({
  brand: z.string().min(1, "Selecione a marca").max(100),
  model: z.string().min(1, "Informe o modelo").max(100),
  version: z.string().min(1, "Informe a versão").max(150),
  year: z.coerce.number().min(1980).max(new Date().getFullYear() + 1),
  modelYear: z.coerce.number().min(1980).max(new Date().getFullYear() + 2),
  km: z.coerce.number().min(0).max(2_000_000),
  price: z.coerce.number().min(1, "Informe o preço").max(100_000_000),
  condition: z.enum(["ZERO_KM", "SEMINOVO"]),
  transmission: z.enum(["MANUAL", "AUTOMATICO", "AUTOMATIZADO", "CVT"]),
  fuel: z.enum(["FLEX", "GASOLINA", "DIESEL", "HIBRIDO", "ELETRICO"]),
  bodyType: z.enum(["SUV", "SEDAN", "HATCH", "PICKUP", "MINIVAN", "COUPE"]),
  color: z.string().min(1, "Informe a cor").max(50),
  doors: z.coerce.number().min(2).max(5),
  plateEnding: z.coerce.number().min(0).max(9),
  renavam: z.string().min(1, "Informe o RENAVAM").max(50),
  badge: z.enum(["NONE", "DESTAQUE", "NOVO"]),
  featured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "SOLD"]).default("ACTIVE"),
  soldAt: z.string().max(40).optional().nullable(),
  description: z.string().min(10, "Descreva o veículo (mínimo 10 caracteres)").max(10_000),
  optionals: z.array(z.string().max(200)).max(100).default([]),
  photos: z.array(z.string().max(2000)).max(50).default([]),
});
export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export const vehicleStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SOLD"]),
  soldAt: z.string().optional().nullable(),
});
export type VehicleStatusValues = z.infer<typeof vehicleStatusSchema>;
