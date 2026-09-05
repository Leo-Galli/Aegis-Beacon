---
title: Test Procedures Overview
description: "The index of every test procedure in the wiki: which test answers which question, and where each one lives."
---

# Test Procedures Overview

The wiki has many test procedures. This page is the index: which test to run for which question.

## The question-to-test map

| Question | Procedure | Where |
| --- | --- | --- |
| Does the radio work at all? | Two beacon bench test | [Two Beacon Bench Test](two-beacon-bench-test) |
| Is the antenna good? | SWR measurement | [VSWR Measurement](vswr-measurement) |
| How far does it reach? | Range test | [Outdoor Testing](outdoor-testing) |
| Is the receiver sensitive? | Attenuator test | [Receiver Testing](receiver-testing) |
| Does the transmitter key cleanly? | Listen test | [Transmitter Testing](transmitter-testing) |
| Does the battery last? | Current measurements | [Power Measurement](power-measurement) |
| Does the GPS work? | Outdoor fix test | [GPS Testing Indoors](gps-testing-indoors) |
| Does the config survive? | Reboot test | [Config Backup](config-backup) |
| Is the whole device good? | Full bench sequence | [Bench Checklist](bench-checklist) |

## The log rule

Every procedure in this index produces numbers for the [Beacon Log Template](beacon-log-template). The procedures without a log entry are the ones that get redone.

## The procedure pyramid

- **Daily**: the [Pack Check Routine](pack-check-routine), one burst.
- **Per change**: the bench sequence, whenever hardware or firmware changes (see [Bench Checklist](bench-checklist)).
- **Seasonal**: the full service (see [Beacon Care Seasonal](beacon-care-seasonal)).

## Related pages

- [Bench Checklist](bench-checklist) for the full sequence
- [Two Beacon Bench Test](two-beacon-bench-test) for the foundation
- [Beacon Log Template](beacon-log-template) for the record