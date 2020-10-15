import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const { Navigator, Screen} = createStackNavigator()

import OrgphanagesMap from './pages/OrphanagesMap'
import OrgphanagesDetails from './pages/OrphanagesDetails'

export default function Routes() {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name="OrgphanagesMap" component={OrgphanagesMap} />
        <Screen name="OrgphanagesDetails" component={OrgphanagesDetails} />
      </Navigator>
    </NavigationContainer>
  )
}