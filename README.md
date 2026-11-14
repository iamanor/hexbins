# CHICAGO CRIME HEXBINS

Double-click open-map.bat in the parent hexbins folder, then open
http://127.0.0.1:8765/ in your browser.
Keep the command window open while using the map. Press Ctrl+C to stop it.
The launcher uses Python already available on this computer. On another
computer, use Python or VS Code's Live Server extension. No build, account,
or API key is needed. Keep all the files and the vendor folder together.
An internet connection is needed for the OpenStreetMap background tiles.

Do not open index.html directly as a file:/// URL: that does not send a
website Referer header, and OpenStreetMap can return 403 Access blocked
images instead of map tiles. A local HTTP server or GitHub Pages supplies
the website origin needed for normal browser tile requests.

Use "Group crimes by" to choose District, Community Area, or Ward. Click
a colored hexagon to see crime counts for that selection, ordered from
most to fewest. The popup lists up to 10 groups present in the hexagon.
Switching the dropdown also updates a popup that is already open.
Equal counts use the group number as the tie-breaker. Community areas
and wards are shown by the numbers recorded in the workbook.
You can also Tab to a hexagon and press Enter or Space to open its popup.
Use the zoom buttons, drag the map, or change the hexagon size to explore.
Reset map returns to the Chicago extent and keeps your selected size.

FILES
../open-map.bat Starts a local web server for this deliverables folder.
index.html     The webpage, controls, and legend.
style.css      The page and hexagon appearance.
script.js      The map, colors, click popup, and selected group ranking.
crime-data.js  Records: [longitude, latitude, district, community area, ward].
vendor/        Unmodified, version-pinned mapping libraries and licenses.
troubles.txt   JavaScript errors, corrections, and verification notes.
../prepare_data.py Optional converter for when the supplied workbook changes.

DATA
Input: Crimes-2025_20261107.xlsx, sheet Crimes_-_2025_20261107.
All 238,208 source rows were read. 235,488 have usable coordinates and are
mapped. 2,720 rows without usable coordinates were omitted. Each mapped
row counts once, including separate crimes at the same location. District
identifiers keep their three-digit format. The original workbook is unchanged.
No crime categories were filtered and no records were randomly sampled.

Hexagon radius is measured in screen pixels, as in the supplied example.
Zooming changes the ground area of a hexagon, so records are regrouped.
Panning at the same zoom keeps the underlying grid fixed. Color thresholds
stay fixed; colors represent counts rather than population-adjusted rates.
District, community area, and ward come from the crime record, not boundary
overlays. Selecting a group changes the popup breakdown; the hexagon total
and color stay the same. Of the mapped crimes, 9 lack a community area and
1 lacks a ward. Missing group values are noted in the popup and not ranked.

TO MAKE SIMPLE CHANGES
1. Change the heading and description in index.html.
2. In script.js, change .domain([100, 500, 2000, 5000]) to change the count
   breaks. Update the five legend labels in index.html to match.
3. Change the five colors in script.js and the matching legend swatches.
4. Change the map height in style.css.
5. To update the data, place the revised workbook under the same filename
   and run prepare_data.py using Python with openpyxl installed. This is
   optional preparation; visitors do not need Python to open the webpage.

SOURCES
Assignment: GES487_GraduateProjectGuidelines_Fall2026.pdf.
Supplied starting code: Hexbins Coding Example.txt (Steven Hall example).
Supplied example link and current plugin documentation:
https://github.com/bluehalo/leaflet-d3
https://github.com/bluehalo/leaflet-d3/blob/master/docs/API.md
Leaflet 1.9.4 documentation: https://leafletjs.com/reference-1.9.4.html
D3 threshold scales: https://d3js.org/d3-scale/threshold
D3 hexbin: https://github.com/d3/d3-hexbin
Background map: https://www.openstreetmap.org/copyright
Tile usage policy: https://operations.osmfoundation.org/policies/tiles/
Exact library versions and license files are listed in vendor/SOURCES.txt.

ASSIGNMENT NOTES
These files provide the requested working map and troubleshooting log.
The guide also requires a separate read-and-modify tutorial with screenshots,
publication to your GitHub Pages site, and presentation slides. Those are
separate submission items; this folder has not been published to GitHub Pages.

AI USAGE RECORD
Tool/model: OpenAI Codex, GPT-6.
Date: November 12, 2026.
Task: Read the supplied materials, convert the workbook data, generate the
HTML/CSS/JavaScript, reproduce compatibility errors, fix map behavior, and
check the results in JavaScript and Chrome.
Revision record: The generated map was revised for current D3 syntax,
correct event arguments, popup click propagation, matching drawing/binning
sizes, and clearer count classes. These revisions were made by the assistant.
Student review and revisions: Complete this part with your own review and
changes before submitting, following the course AI policy in the guide.
