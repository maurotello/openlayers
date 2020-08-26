window.onload = init;
function init(){
	var map, satelite, vectors, nuevos, geojson, measureControls, renderer;
	
	map = new ol.Map({
		target: 'js-map',
		view: new ol.View({
			center: ol.proj.fromLonLat([-62.9966800, -40.8134500]),
			zoom: 4,
			maxZoom: 10,
			minZoom: 1
			//projection: "EPSG:4326"
		}),
	})

/*
	var select = new Select({
	  wrapX: false,
	});

	var modify = new Modify({
	  features: select.getFeatures(),
	});

*/
	const openStreetMapStandard = new ol.layer.Tile({
		source: new ol.source.OSM(),
		visible: false,
		title: 'openStreetMapStandard'
	})

	const openStreetMapHumanitarian = new ol.layer.Tile({
		source: new ol.source.OSM({
			url: 'https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
			attributions: [ ol.source.OSM.ATTRIBUTION, 'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>' ],
			maxZoom: 18
		}),
		visible: true,
		title: 'openStreetMapHumanitarian'
	})

	//map.addLayer(openStreetMapStandard);
	const baseLayerGroup = new ol.layer.Group({
		layers: [
			openStreetMapStandard, openStreetMapHumanitarian
		]
	})
	map.addLayer(baseLayerGroup);

	// layer switcher logic for basemaps
	const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]');

	for(let baseLayerElement of baseLayerElements){
		baseLayerElement.addEventListener('change', function(){
			let baseLayerElementValue = this.value;
			baseLayerGroup.getLayers().forEach(function(element, index, array){
				let baseLayerTitle = element.get('title');
				element.setVisible(baseLayerTitle === baseLayerElementValue);
			})
		})
	}

	const fillStyle = new ol.style.Fill({
		color: [84, 118, 255, 1]
	})

	const strokeStyle = new ol.style.Stroke({
		color: [46, 45, 45, 1],
		width: 1.2
	})

	const circleStyle = new ol.style.Circle({
		fill: new ol.style.Fill({
			color: [245, 49, 5, 1]
		}),
		radius: 7,
		stroke: strokeStyle
	})


	const Provinces = new ol.layer.VectorImage({
		source: new ol.source.Vector({
			url: 'data/geojson/countries.geojson',
			format: new ol.format.GeoJSON(),
			wrapX: false
		}),
		visible: true,
		title: 'Provinces'
	})
	map.addLayer(Provinces);

	// vertor layer
	const EUContriesGeoJSON = new ol.layer.VectorImage({
		source: new ol.source.Vector({
			url: 'map.geojson',
			format: new ol.format.GeoJSON()
		}),
		visible: true,
		title: 'EUContriesGeoJSON',
		style: new ol.style.Style({
			fill: fillStyle,
			stroke: strokeStyle,
			image: circleStyle
		})
	})
	map.addLayer(EUContriesGeoJSON);

	// Vector Feature Popup Logic
	const overlayContainerElement = document.querySelector('.overlay-container');

	const overlayLayer = new ol.Overlay({
		element: overlayContainerElement
	})

	map.addOverlay(overlayLayer);

	const overlayFeatureName = document.getElementById('feature-name');
	const overlayFeatureAdditionalInfo = document.getElementById('feature-additional-info');

	map.on('click', function(e){
		overlayLayer.setPosition(undefined);
		map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
			let clickedCoordinate = e.coordinate;
			let clickedFeatureName = feature.get('name'); // esto es si está en el valor del vector sino no aparece
			let clickedFeatureAdditionInfo = feature.get('additionalinfo'); // esto es si está en el valor del vector sino no aparece
			overlayLayer.setPosition(clickedCoordinate);
			overlayFeatureName.innerHTML = clickedFeatureName;
			overlayFeatureAdditionalInfo.innerHTML = clickedFeatureAdditionInfo;
		},
		{
			layerFilter: function(layerCandidate){
				return layerCandidate.get('title') === 'EUContriesGeoJSON'
			}
		}
		)

	})
}