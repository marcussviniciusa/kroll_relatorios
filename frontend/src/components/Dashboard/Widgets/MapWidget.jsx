import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  CircularProgress,
  Tooltip,
  Slider
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// Using Leaflet for map visualization
// Note: These packages need to be installed:
// npm install leaflet react-leaflet

const MapWidget = ({ 
  title, 
  description, 
  data, 
  loading, 
  error, 
  config = {},
  settings = {}
}) => {
  const theme = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(5);
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
  
  // Extract config options with defaults
  const {
    center = [-15.77972, -47.92972], // Default to Brazil
    minZoom = 2,
    maxZoom = 18,
    defaultZoom = 5,
    markerField = 'location',
    valueField = 'value',
    nameField = 'name',
    markerColors = {},
    defaultMarkerColor = theme.palette.primary.main,
    tileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    showHeatmap = false
  } = config;
  
  // Extract settings
  const {
    appearance = {},
    display = {}
  } = settings;
  
  const {
    showTitle = true,
    showDescription = true,
    colorTheme = 'default',
    transparent = false,
    shadow = 'medium',
    borderRadius = 'medium'
  } = appearance;
  
  const {
    showZoomControls = true,
    showTooltips = true,
    showLegend = true
  } = display;
  
  // Load leaflet dynamically on client-side only
  useEffect(() => {
    // We need to dynamically import Leaflet since it depends on window object
    if (typeof window !== 'undefined' && !mapLoaded) {
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
      link.integrity = 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=';
      link.crossOrigin = '';
      document.head.appendChild(link);
      
      // We'll initialize the map after imports
      import('leaflet').then(L => {
        // Now load React-Leaflet which depends on Leaflet
        import('react-leaflet').then(({ MapContainer, TileLayer, Marker, Popup, useMap }) => {
          setMapLoaded(true);
          
          // Initialize map after component is mounted
          setTimeout(() => {
            const mapElement = document.getElementById(mapId);
            if (mapElement) {
              // Initialize the map
              const leafletMap = L.map(mapId, {
                center: center,
                zoom: defaultZoom,
                minZoom: minZoom,
                maxZoom: maxZoom,
                zoomControl: false
              });
              
              // Add tile layer
              L.tileLayer(tileProvider, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(leafletMap);
              
              // Add markers for each data point
              if (data && data.length > 0) {
                data.forEach(item => {
                  if (item[markerField]) {
                    const location = parseLocation(item[markerField]);
                    if (location) {
                      // Determine marker color
                      let markerColor = defaultMarkerColor;
                      if (markerColors && typeof markerColors === 'object') {
                        // Check if there's a color mapping for this value
                        Object.keys(markerColors).forEach(key => {
                          const matcher = new RegExp(key, 'i');
                          if (
                            (item[valueField] && matcher.test(item[valueField].toString())) || 
                            (item[nameField] && matcher.test(item[nameField].toString()))
                          ) {
                            markerColor = markerColors[key];
                          }
                        });
                      }
                      
                      // Create custom icon
                      const icon = L.divIcon({
                        className: 'custom-map-marker',
                        html: `<div style="
                          background-color: ${markerColor};
                          width: 12px;
                          height: 12px;
                          border-radius: 50%;
                          border: 2px solid white;
                          box-shadow: 0 0 4px rgba(0,0,0,0.4);
                        "></div>`,
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                      });
                      
                      // Add marker
                      const marker = L.marker([location.lat, location.lng], { icon }).addTo(leafletMap);
                      
                      // Add popup if showTooltips is enabled
                      if (showTooltips) {
                        const popupContent = createPopupContent(item);
                        marker.bindPopup(popupContent);
                      }
                    }
                  }
                });
              }
              
              // Add heatmap if enabled and heatmap library is loaded
              if (showHeatmap && data && data.length > 0) {
                import('leaflet.heat').then(heat => {
                  const heatPoints = data
                    .filter(item => item[markerField])
                    .map(item => {
                      const location = parseLocation(item[markerField]);
                      if (location) {
                        const intensity = item[valueField] || 1;
                        return [location.lat, location.lng, Math.min(intensity / 10, 1)];
                      }
                      return null;
                    })
                    .filter(point => point !== null);
                  
                  if (heatPoints.length > 0) {
                    L.heatLayer(heatPoints, { 
                      radius: 25, 
                      blur: 15,
                      maxZoom: 10
                    }).addTo(leafletMap);
                  }
                }).catch(err => {
                  console.error('Error loading heatmap library:', err);
                });
              }
              
              // Store map reference
              setMap(leafletMap);
              setZoom(defaultZoom);
            }
          }, 100);
        }).catch(err => {
          console.error('Error loading React-Leaflet:', err);
        });
      }).catch(err => {
        console.error('Error loading Leaflet:', err);
      });
    }
    
    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [data]);
  
  // Helper to parse location data
  const parseLocation = (location) => {
    // Handle array [lat, lng]
    if (Array.isArray(location) && location.length >= 2) {
      return { lat: location[0], lng: location[1] };
    }
    
    // Handle {lat, lng} object
    if (location && typeof location === 'object' && 'lat' in location && 'lng' in location) {
      return location;
    }
    
    // Handle {latitude, longitude} object
    if (location && typeof location === 'object' && 'latitude' in location && 'longitude' in location) {
      return { lat: location.latitude, lng: location.longitude };
    }
    
    // Handle "lat,lng" string
    if (typeof location === 'string') {
      const parts = location.split(',').map(part => parseFloat(part.trim()));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { lat: parts[0], lng: parts[1] };
      }
    }
    
    return null;
  };
  
  // Create popup content
  const createPopupContent = (item) => {
    let content = '<div style="min-width: 150px">';
    
    // Add name if available
    if (item[nameField]) {
      content += `<div style="font-weight: bold; margin-bottom: 5px">${item[nameField]}</div>`;
    }
    
    // Add value if available
    if (item[valueField] !== undefined) {
      let formattedValue = item[valueField];
      
      // Format number values
      if (typeof formattedValue === 'number') {
        formattedValue = formattedValue.toLocaleString('pt-BR');
      }
      
      content += `<div><strong>Valor:</strong> ${formattedValue}</div>`;
    }
    
    // Add any additional fields from the item (excluding those already shown)
    Object.keys(item).forEach(key => {
      if (
        key !== markerField && 
        key !== nameField && 
        key !== valueField && 
        item[key] !== undefined && 
        item[key] !== null
      ) {
        let value = item[key];
        
        // Format date values
        if (value instanceof Date) {
          value = value.toLocaleDateString('pt-BR');
        }
        
        // Format number values
        if (typeof value === 'number') {
          value = value.toLocaleString('pt-BR');
        }
        
        // Skip complex objects
        if (typeof value !== 'object') {
          content += `<div><strong>${key}:</strong> ${value}</div>`;
        }
      }
    });
    
    content += '</div>';
    return content;
  };
  
  // Handle zoom changes
  const handleZoomChange = (event, newValue) => {
    setZoom(newValue);
    if (map) {
      map.setZoom(newValue);
    }
  };
  
  // Handle zoom in button
  const handleZoomIn = () => {
    if (map) {
      const newZoom = Math.min(map.getZoom() + 1, maxZoom);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };
  
  // Handle zoom out button
  const handleZoomOut = () => {
    if (map) {
      const newZoom = Math.max(map.getZoom() - 1, minZoom);
      map.setZoom(newZoom);
      setZoom(newZoom);
    }
  };
  
  // Generate shadow styles based on setting
  const getShadowStyle = () => {
    if (transparent) return {};
    
    switch (shadow) {
      case 'none':
        return {};
      case 'light':
        return { boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' };
      case 'strong':
        return { boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' };
      case 'medium':
      default:
        return { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' };
    }
  };
  
  // Generate border radius styles
  const getBorderRadiusStyle = () => {
    switch (borderRadius) {
      case 'none':
        return { borderRadius: 0 };
      case 'small':
        return { borderRadius: theme.shape.borderRadius / 2 };
      case 'large':
        return { borderRadius: theme.shape.borderRadius * 2 };
      case 'medium':
      default:
        return { borderRadius: theme.shape.borderRadius };
    }
  };

  return (
    <Paper 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 2,
        bgcolor: transparent ? 'transparent' : 'background.paper',
        ...getShadowStyle(),
        ...getBorderRadiusStyle(),
      }}
      elevation={transparent ? 0 : 1}
    >
      {/* Widget header */}
      {(showTitle && title) && (
        <Box sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 500, flex: 1 }}>
            {title}
          </Typography>
          
          {description && (
            <Tooltip title={description} placement="top">
              <InfoOutlinedIcon fontSize="small" color="action" sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Box>
      )}
      
      {/* Description if not in tooltip */}
      {(showDescription && description && !showTitle) && (
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ mb: 2 }}
        >
          {description}
        </Typography>
      )}
      
      {/* Map content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" color="error" align="center">
              Erro ao carregar dados: {error}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Map container */}
            <Box 
              id={mapId}
              sx={{ 
                width: '100%',
                flex: 1,
                '.leaflet-container': {
                  width: '100%',
                  height: '100%',
                  background: '#f8f8f8'
                }
              }}
            />
            
            {/* Zoom controls */}
            {showZoomControls && (
              <Box sx={{ 
                position: 'absolute', 
                right: 10, 
                top: 10, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                p: 0.5
              }}>
                <Box 
                  component="button"
                  onClick={handleZoomIn}
                  sx={{ 
                    cursor: 'pointer',
                    border: 'none',
                    bgcolor: 'transparent',
                    borderRadius: 1,
                    p: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </Box>
                <Box 
                  component="button"
                  onClick={handleZoomOut}
                  sx={{ 
                    cursor: 'pointer',
                    border: 'none',
                    bgcolor: 'transparent',
                    borderRadius: 1,
                    p: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ZoomOutIcon fontSize="small" />
                </Box>
              </Box>
            )}
            
            {/* Legend if enabled */}
            {showLegend && Object.keys(markerColors).length > 0 && (
              <Box sx={{ 
                position: 'absolute', 
                left: 10, 
                bottom: 10, 
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                p: 1,
                maxWidth: '40%'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 500, mb: 0.5, display: 'block' }}>
                  Legenda
                </Typography>
                {Object.entries(markerColors).map(([key, color]) => (
                  <Box 
                    key={key}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 0.5,
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%',
                        bgcolor: color,
                        border: '2px solid white',
                        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                        mr: 1
                      }} 
                    />
                    <Typography variant="caption">
                      {key}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
};

MapWidget.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  config: PropTypes.object,
  settings: PropTypes.object
};

export default MapWidget;
