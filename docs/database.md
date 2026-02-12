# Database Schema

## Current Tables

### `agreements`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| valid_from | DATE | NOT NULL |
| valid_to | DATE | NOT NULL, CHECK >= valid_from |
| supplier_code | VARCHAR(20) | NOT NULL, FK → ref_suppliers.code |
| agreement_type_code | VARCHAR(20) | NOT NULL, FK → ref_agreement_types.code |
| condition_value | NUMERIC(15,2) | NOT NULL, CHECK > 0 |
| status | ENUM | NOT NULL, default READY_FOR_CALCULATION |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | NOT NULL, auto-updated via trigger |

**Indexes:** created_at DESC, supplier_code, agreement_type_code, status

**Trigger:** `trigger_agreements_updated_at` — auto-updates `updated_at` on row update.

### `ref_suppliers`
| Column | Type | Constraints |
|--------|------|-------------|
| code | VARCHAR(20) | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |

### `ref_agreement_types`
| Column | Type | Constraints |
|--------|------|-------------|
| code | VARCHAR(20) | PRIMARY KEY |
| name | VARCHAR(255) | NOT NULL |
| grid | ENUM(PERCENT, FIX) | NOT NULL |

### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| username | VARCHAR(150) | NOT NULL, UNIQUE, INDEXED |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| hashed_password | VARCHAR(255) | NOT NULL |
| is_active | BOOLEAN | DEFAULT true |
| is_admin | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | NOT NULL |

## Migrations

| # | Name | Description |
|---|------|-------------|
| 001 | create_agreements_table | Initial agreements schema |
| 002 | create_users_table | User authentication table |
| 003 | add_status_to_agreements | Agreement status workflow |
| 004 | add_reference_tables | Supplier/type reference tables, restructure agreements |
| 005 | add_indexes_and_trigger | Performance indexes + updated_at trigger |

## Future: Calculation Tables (Design Only)

### `calc_runs`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| agreement_id | UUID | FK → agreements.id |
| run_date | DATE | NOT NULL |
| status | ENUM | PENDING, RUNNING, COMPLETED, FAILED |
| started_at | TIMESTAMP | |
| completed_at | TIMESTAMP | |
| error_message | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### `calc_results`
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| calc_run_id | UUID | FK → calc_runs.id |
| period_from | DATE | NOT NULL |
| period_to | DATE | NOT NULL |
| base_amount | NUMERIC(15,2) | turnover/purchase base |
| bonus_amount | NUMERIC(15,2) | calculated bonus |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
