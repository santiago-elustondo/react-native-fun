import React from 'react'
import { Platform, ProgressBarAndroid, ProgressViewIOS } from 'react-native'

export class LoadingSpinner extends React.Component { 
  render() {
    const { style } = this.props

    return Platform.OS === 'ios' ? (
      <ProgressViewIOS style={style}/>
    ) : (
      <ProgressBarAndroid style={style}/>
    )
  }
}