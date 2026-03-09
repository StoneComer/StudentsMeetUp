export interface Profile {
  'id': string,
  'username': string,
  'email': string,
  'telegramId': string
}

export interface Login {
  client_id: 'reminder-backend',
  grant_type: 'password',
  email: string,
  username: string,
  password: string,
}

export interface Reminder {
  id: number,
  title: string,
  description: string,
  remind: string
}

export interface ReminderCreate {
  title: string,
  description: string,
  remind: string
}

