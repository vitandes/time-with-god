// ExpoReactNativeFactoryPatch.swift
import Foundation
import ExpoModulesCore

// Esta extensión modifica ExpoReactNativeFactory para solucionar el error de reactNativeFactory
@objc public extension ExpoReactNativeFactory {
  @objc override func createReactDelegate() -> ExpoReactDelegate {
    return ExpoReactDelegate(handlers: ExpoAppDelegateSubscriberRepository.reactDelegateHandlers, reactNativeFactory: self)
  }
}