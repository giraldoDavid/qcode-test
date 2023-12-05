import 'dotenv/config';
import { get } from 'env-var';

export const envs = {

    PORT: get('PORT').required().asPortNumber(),

    API_URL: get('API_URL').required().asString(),
}