# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Render nulls, undefined, zeroes and false correctly and more in line with how template strings do.

### [3.0.0] - 2023-07-07

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
