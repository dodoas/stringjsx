# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.1] - 2023-03-12

### Fixed

- Revert type: module change in 4.0.0, which causes build tools to expect modern
modules when pulling the code in.

## [4.0.0] - 2023-03-11

### Changed

- Render nulls, undefined, zeroes and false; more in line with how template strings do. (https://github.com/dodoas/stringjsx/pull/3) **This is a breaking change. Make sure to review any existing code so that you don't render nulls on production.**

## [3.0.0] - 2023-07-07

- This version marks the fork from [vhtml](https://www.npmjs.com/package/vhtml)

### Added

- Typescript support (no additional @types/ package is required) (thanks to [pastelmind](https://github.com/pastelmind) for his type definitions for vhtml, these are simply adapted from his by @odinhb)
- New way to skip sanitization by passing a string with `_stringjsx_sanitized = true` set. ([remziatay](https://github.com/remziatay) had the idea [here](https://github.com/developit/vhtml/issues/34#issuecomment-1460436783))

### Changed

- Returns a `String` (object, not primitive) ([remziatay](https://github.com/remziatay) had the idea [here](https://github.com/developit/vhtml/issues/34#issuecomment-1460436783))
- Rewrote the source code itself (@odinhb)

### Fixed

- Fix [injection possibility](https://github.com/developit/vhtml/issues/34)
- Fix [memory leak](https://github.com/developit/vhtml/issues/20)
