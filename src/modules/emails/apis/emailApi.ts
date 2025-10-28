import axios from "axios";
import api from "../../../shares/configs/axios";

const endpoint = "/hospital/emails";

interface SendCancelNotificationBody {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

class EmailClient {
  private readonly client: typeof api;

  constructor() {
    this.client = api;
  }

  // ---------------- Send Cancel Notification ----------------
  async sendCancelNotification(body: SendCancelNotificationBody) {
    const response = await this.client.post(`${endpoint}/send-cancel-notification`, body);
    return response.data;
  }
}

const EmailApi = new EmailClient();
export { EmailApi };
