import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  overlayTouchable: { 
    position: 'absolute',
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0, 
    elevation: 10,
    zIndex:999
  },
  overlayColor: { 
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0, 
    backgroundColor: 'gray', 
    elevation: 10,
    opacity: 0.3,
    zIndex:9999
  },
  drawerOuter: { 
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    backgroundColor: '#f2f2f2', 
    elevation: 10,
    opacity: 1,
    zIndex:9999,
    flexDirection: 'column',
    overflow: 'hidden'
  },
  drawerInner: { 
    width: 250,
    padding: 10,
    flexDirection: 'column',
    height: '100%'
  },
  usernameRowOuter: { 
    flexDirection:'row', 
    alignItems:'flex-end', 
    borderRadius: 10 
  },
  usernameRowInner: { 
    flex:1, 
    flexDirection: 'row', 
    alignItems:'center' 
  },
  usernameIcon: { 
    fontSize: 30, 
    margin: 10 
  },
  usernameText: { 
    fontSize: 30, 
    margin: 10 
  },
  space: {
    flex:1
  }
})