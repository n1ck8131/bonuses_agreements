# Calculation Engine

## Overview

The calculation engine is designed using the **Strategy pattern** to support different bonus calculation methods based on agreement type.

## Architecture

```
CalculationEngine (engine.py)
    │
    ├── register(agreement_type_code, strategy_class)
    └── run(agreement_id, period_from, period_to)
            │
            ├── PercentTurnoverStrategy (strategies/percent_turnover.py)
            └── [Future strategies...]
```

## Components

### `CalculationStrategy` (base.py)
Abstract base class defining the interface:
```python
async def calculate(agreement_id, period_from, period_to) -> Decimal
```

### `CalculationEngine` (engine.py)
Strategy dispatcher with a registry mapping agreement type codes to strategy classes.

### Strategies
- `PercentTurnoverStrategy` — calculates bonus as percentage of turnover (skeleton, not implemented)

## Design Principles

- **Idempotent runs** — re-running a calculation for the same period produces the same result
- **Reproducibility** — calculation inputs and outputs are fully traceable via `calc_runs` and `calc_results` tables
- **Extensibility** — new strategies can be registered without modifying existing code

## Future Roadmap

1. Implement `PercentTurnoverStrategy` with actual data access
2. Create `calc_runs` and `calc_results` database tables
3. Add tier logic support (multi-tier percentage brackets)
4. Integrate with agreement status transitions (READY_FOR_CALCULATION → CALCULATED)
5. Add bulk calculation support (multiple agreements in one run)
