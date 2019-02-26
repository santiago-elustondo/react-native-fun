import { AsyncStorage } from 'react-native'
import { ThinkerSDK } from './thinker-sdk'

export const thinker = new ThinkerSDK(AsyncStorage)