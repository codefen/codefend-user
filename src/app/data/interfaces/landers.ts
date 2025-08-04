/**
 * Interfaces para los datos de landers y conversiones
 */

export interface LanderData {
  id: number;
  ip_hash: string;
  ip_address: string;
  page_type: 'signup' | 'signin';
  ua: string | null;
  hci: string | null;
  hxff: string | null;
  pais: string | null;
  pais_code: string | null;
  provincia: string | null;
  ciudad: string | null;
  creacion: string; // ISO datetime string
  became_lead: 0 | 1;
  lead_email: string | null;
  lead_created_at: string | null; // ISO datetime string
  // ✅ SISTEMA FLEXIBLE - permite cualquier string sin restricciones
  device_class: string | null; // phone, desk, mid_size, bots, smart_tv, wearable, unknown, etc.
  device_os: string | null;    // windows, macos, linux, ios, android, googlebot, bingbot, facebook, unknown, etc.
}

export interface LanderConversionStats {
	general: {
		total_landers: number;
		total_leads: number;
		total_not_converted: number;
		conversion_rate: number;
	};
	by_page_type: Array<{
		page_type: 'signup' | 'signin';
		total_visits: number;
		total_conversions: number;
		conversion_rate: number;
	}>;
	daily: Array<{
		date: string; // YYYY-MM-DD format
		total_visits: number;
		total_conversions: number;
		conversion_rate: number;
	}>;
	by_country: Array<{
		pais: string;
		total_visits: number;
		total_conversions: number;
		conversion_rate: number;
	}>;
	hourly: Array<{
		hour: number; // 0-23
		total_visits: number;
		total_conversions: number;
		conversion_rate: number;
	}>;
	trend?: {
		conversion_rate_change: number;
		visits_change: number;
		leads_change: number;
		previous_period: {
			total_landers: number;
			total_leads: number;
			conversion_rate: number;
		};
	};
	period_days: number;
}

export interface LanderPagination {
	limit: number;
	page: number;
	offset: number;
	total_records: number;
	total_pages: number;
	has_next: boolean;
	has_prev: boolean;
}

export interface LandersApiResponse {
	error: string;
	response: string;
	info: string;
	landers: LanderData[]; // Nota: el PHP usa 'landers', no 'data'
	pagination: LanderPagination;
}

export interface ConversionStatsApiResponse {
	error: string;
	response: string;
	info: string;
	stats: LanderConversionStats;
} 