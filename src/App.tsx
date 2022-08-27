import React, { Component } from 'react';
import { Ion, Viewer, createWorldTerrain, createOsmBuildings, Cartesian3, Math } from "cesium";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css"

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUXMVEBToBmqS8kuYpUlxJHYZxk';
// working branch
export default class App extends Component {
  viewer: Viewer;
  cesiumContainer: string | Element;
  componentDidMount() {
    this.viewer = new Viewer(this.cesiumContainer, {
      terrainProvider: createWorldTerrain()
    });
    console.log('this. ', this.viewer);
    this.viewer.scene.primitives.add(createOsmBuildings());
    this.viewer.camera.flyTo({
      destination : Cartesian3.fromDegrees(-84.51603, 39.0954, 500),
      orientation : {
        heading : Math.toRadians(0.0),
        pitch : Math.toRadians(-15.0),
      }
    });
  }

  render() {
    return (
      <div 
        id="cesiumContainer" 
        ref={ element => this.cesiumContainer = element }
      />
    );
  }
}

