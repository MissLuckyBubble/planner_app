import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
const MapComponent = ({ businessName, businessCategories, width, height, latitude, longitude }) => {

  const categoryTitles = businessCategories && businessCategories.map(category => category.title);
  const categories = categoryTitles && categoryTitles.join(', ');

  return (
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={[styles.mapStyle, {height: height, width:width}]}
      zoomEnabled={true}
      scrollEnabled={false}
      region={{
        latitude: latitude && latitude != null  ? latitude : 42.136097,
        longitude: longitude && longitude != null  ? longitude : 24.742168,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
           latitude: latitude && latitude != null ? latitude : 42.136097,
           longitude: longitude && longitude != null  ? longitude : 24.742168, }}
        title={businessName}
        description={categories && categories}
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    height: 400,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapComponent;
