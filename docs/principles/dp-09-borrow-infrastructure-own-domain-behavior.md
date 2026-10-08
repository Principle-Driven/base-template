# DP-09 — Borrow infrastructure and own domain behavior
Token: DP-09
Version: v1
Source: https://principledriven.dev/principles/borrow-infrastructure-own-domain-behavior

## Rule

Use maintained packages for established infrastructure problems. Keep domain rules and product behavior under your ownership.

Before you fork or replace a package, try its public APIs and extension points.

Before you create custom infrastructure, name the product requirement that existing packages cannot reasonably satisfy. Account for ongoing maintenance.

Remove constraints that come only from the proposed implementation.

### Exceptions

A concrete product requirement can justify a fork or custom mechanism. Record why supported alternatives fail and who owns future maintenance.

A small domain function does not need a dependency merely because a package exists. Compare the actual complexity and cost.

## Rationale

Agents invent implementation constraints and use them to justify private infrastructure forks. The team inherits maintenance without a product requirement.

## History

- v1 (2026-10-08): Adopted from catalog v1.
