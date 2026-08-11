# Esquema de base de datos

## Entidades principales

### users
- id (UUID)
- google_id
- email
- full_name
- created_at
- updated_at

### user_preferences
- id (UUID)
- user_id (FK)
- currency
- timezone
- monthly_costs
- billable_hours

### quotations
- id (UUID)
- user_id (FK)
- service_type
- hours_estimated
- experience_level
- client_location
- currency
- urgency
- minimum_amount
- ideal_amount
- premium_amount
- created_at

### exchange_rates
- id (UUID)
- base_currency
- target_currency
- rate
- fetched_at
