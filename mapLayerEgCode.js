n.default={
	mixins:[t.default],
	data:function(){
		return{
			colors:["#a52714","#9c27b0","#0f9d58","#1492a6","#a67014"],
			startingZoom:15,
			minZoom:13,
			maxZoom:16,
			lat:40.7654184,
			lon:-73.9791558,
			markerSize:7.25,
			markerPadding:6,
			map:void 0,
			sourceFeatures:[],
			currentLayer:"all",
			bounds:[[-74.01848,40.74817],[-73.91667,40.79]],
			layers:[
			["arts-and-culture","Arts & Culture",["Al Hirschfeld Theatre","Alvin Ailey American Dance Theater","Ambassador Theatre","Belasco Theatre","Booth Theatre","Carnegie Hall","Eugene O'Neill Theatre","Gershwin Theatre","Helen Hayes Theatre","Jazz at Lincoln Center","Lincoln Center for the Performing Arts","Lyceum Theatre","Marian Goodman Gallery","Museum of Arts and Design (MAD)","Neil Simon Theatre","New Amsterdam Theatre","Palace Theatre","Park Avenue Armory","Phillips","Shubert Theatre","Solomon R. Guggenheim Museum","Stack's Bowers Rare Coin Galleries","The Broadway Theatre","The Museum of Modern Art","The Paris Theatre","Theatre District","University Club","Winter Garden Theatre"]],
			["restaurants-and-epicurean","Restaurants & Epicurean",["21 Club","Asiate","Bar Boulud","Bobby Van's Steakhouse - CPS","Boulud Sud","Brasserie 8 1/2","Brasserie Cognac","Cafe Fiorello","Daniel","Estiatorio Milos","FIKA","Ippudo Westside","Jean-Georges","Juice Press","Ladurée New-York Madison","Le Bernardin","Marea","Masa","Morton Williams","Nobu Fifty Seven","Ocean Prime","Per Se","Petrossian","Quality Meats","Radiance Tea House & Books","Redeye Grill","Rotisserie Georgette","Rue 57","Sarabeth's","The Polo Bar","The Russian Tea Room","The Smith","The Wayfarer","Todd English Food Hall","Tori Shin","Trattoria Dell'Arte","Whole Foods Market"]],
			["shopping","Shopping",["a.testoni","Alexander McQueen","Apple Fifth Avenue","Arche","Ascot Chang","Barneys New York","Bergdorf Goodman","Bottega Veneta","Brunello Cucinelli","Burberry","BVLGARI","Carolina Herrera","Cartier","CÉLINE","CHANEL","Chloé","Chopard Boutique","Club Monaco","COACH","David Yurman Townhouse","Davidoff of Geneva","Diesel","Dior","diptyque","Domenico Spano","Etro","Fendi","Graff Diamonds","Harry Winston","Henri Bendel","Hermès","Jo Malone London","Kate Spade New York","L'Occitane en Provence","Louis Vuitton","MacKenzi-Childs","Manolo Blahnik","Marni","Metropolitan Fine Arts & Antiques","Microsoft","Nespresso Madison Boutique & Cafe","Nike Town","Nordstrom (Coming Soon)","Oscar de la Renta","Prada","rag & bone","Riflessi","Salvatore Ferragamo","Stuart Weitzman","Sunglass Hut","Swarovski","Ted Baker","The Fur Source of NY","Thomas Pink","Tiffany & Co.","Tom Ford","TUMI","VALENTINO","Van Cleef & Arpels","Versace","Williams-Sonoma"]],
			["central-park","Central Park",["Belvedere Castle","Bethesda Terrace","Billy Johnson Playground","Central Park Zoo","Cherry Hill Fountain","Delacorte Clock","Heckscher Ballfields","Heckscher Playground","Sheep Meadow","Strawberry Fields","The Loeb Boathouse","The Pond","The Ramble","Wollman Rink"]],
			["wellness","Wellness",["Barry's Bootcamp","Equinox","Exhale New York","New York Athletic Club","Physique 57","Pure Barre","Soul Cycle"]]]
		}
	},
	methods:{
		initMap:function(){
			var e=this;
			mapboxgl.accessToken="pk.eyJ1IjoiYmx1bmRxdWlzdCIsImEiOiJPWVlpS21JIn0.SthsZ9UWsM95dj9vWlUlSg",
			this.map=new mapboxgl.Map({
				container:"mapbox-container",
				style:"mapbox://styles/blundquist/cizog6mp0004d2smyveisy43t",
				center:[this.lon,this.lat],
				minZoom:this.minZoom,
				maxZoom:this.maxZoom,
				pitch:0,
				zoom:this.startingZoom,
				maxBounds:this.bounds,
				bearing:29
			}),
			this.map.scrollZoom.disable(),
			this.map.doubleClickZoom.disable(),
			this.map.addControl(new mapboxgl.NavigationControl,"bottom-left"),
			this.map.on("style.load",function(){e.addDataLayers(),e.showTooltips()})
		},
		addDataLayers:function(){
			this.map.addLayer({
				"source-layer":"one57-locations",
				source:{
					type:"vector",
					url:"mapbox://blundquist.cj35g9qw600sw32qgb5hwhjwf-33j8y"
				},
				id:"arts-and-culture",
				type:"circle",
				filter:["==","category","Arts & Culture"],
				paint:{
					"circle-color":this.colors[0],
					"circle-radius":this.markerSize,
					"circle-stroke-width":this.markerPadding,
					"circle-stroke-color":"transparent"
				}
			}),
			this.map.addLayer({
				"source-layer":"one57-locations",
				source:{
					type:"vector",
					url:"mapbox://blundquist.cj35g9qw600sw32qgb5hwhjwf-33j8y"
				},
				id:"restaurants-and-epicurean",
				type:"circle",
				filter:["==","category","Restaurants & Epicurean"],
				paint:{
					"circle-color":this.colors[1],
					"circle-radius":this.markerSize,
					"circle-stroke-width":this.markerPadding,
					"circle-stroke-color":"transparent"
				}
			}),
			this.map.addLayer({
				"source-layer":"one57-locations",
				source:{
					type:"vector",
					url:"mapbox://blundquist.cj35g9qw600sw32qgb5hwhjwf-33j8y"
				},
				id:"shopping",
				type:"circle",
				filter:["==","category","Shopping"],
				paint:{
					"circle-color":this.colors[2],
					"circle-radius":this.markerSize,
					"circle-stroke-width":this.markerPadding,
					"circle-stroke-color":"transparent"
				}
			}),
			this.map.addLayer({
				"source-layer":"one57-locations",
				source:{
					type:"vector",
					url:"mapbox://blundquist.cj35g9qw600sw32qgb5hwhjwf-33j8y"
				},
				id:"central-park",
				type:"circle",
				filter:["==","category","Central Park"],
				paint:{
					"circle-color":this.colors[3],
					"circle-radius":this.markerSize,
					"circle-stroke-width":this.markerPadding,
					"circle-stroke-color":"transparent"
				}
			}),
			this.map.addLayer({
				"source-layer":"one57-locations",
				source:{
					type:"vector",
					url:"mapbox://blundquist.cj35g9qw600sw32qgb5hwhjwf-33j8y"
				},
				id:"wellness",
				type:"circle",
				filter:["==","category","Wellness"],
				paint:{
					"circle-color":this.colors[4],
					"circle-radius":this.markerSize,
					"circle-stroke-width":this.markerPadding,
					"circle-stroke-color":"transparent"
				}
			})
		},
		toggleLayers:function(e){var t=this,n=$(e.target).attr("data-layer");

