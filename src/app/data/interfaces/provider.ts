export interface Provider {
	id: string;
	company_id: string;
	company_access_ids: string;
	fname: string;
	lname: string;
	username: string;
	role: string;
	headline: string;
	id_verified: string | boolean;
	access_role: string;
	email: string;
	phone: string;
	password: string;
	profile_media: string;
	mfa_llave: string;
	pais: string;
	pais_code: string;
	pais_provincia: string;
	pais_ciudad: string;
    reseller_id: string;
	reseller_name: string;
	eliminado: boolean;
	creacion: string;
	user_id: string;
	show_email_and_phone: string;
	business_phone: string;
	main_desc: string;
	finished_orders: number;
	score: number;
	reviews_final: number;
}
/* 
{
	"id": "23",
	"company_id": "1",
	"company_access_ids": "",
	"fname": "Edgardo",
	"lname": "Krause",
	"username": "eddkrause",
	"role": "developer",
	"access_role": "hacker",
	"email": "eddkrause@codefend.com",
	"phone": "5491164750409",
	"password": "c0d16ef4726b21b0bd364aa855ce763e5fe4486d52040ed40ad29e8757e1024a",
	"id_verified": "1",
	"mfa_llave": "disabled",
	"profile_media": "\/9j\/4AAQSkZJRg",
	"pais": "Colombia",
	"pais_code": "CO",
	"pais_provincia": "Santander",
	"pais_ciudad": "Floridablanca",
	"reseller_id": "",
	"reseller_name": "",
	"eliminado": "0",
	"creacion": "2023-11-08 12:34:52",
	"user_id": "23",
	"headline": "Offensive security researcher",
	"show_email_and_phone": "1",
	"business_phone": "5491164750409",
	"main_desc": "<p><b>I love hacking, discoverin",
	"finished_orders": "0",
	"score": "0",
	"reviews_final": "0"
}
*/