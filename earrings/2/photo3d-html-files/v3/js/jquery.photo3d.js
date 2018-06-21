(function ($) {
	var methods = {
		init: function (options) {
			var set = $.extend({
				'trendCorrect': 0, // Коррекция направления вращения, 0 стандарт по умолчанию, 1 в обратном направлении
				'formButtons': "20px 5px", // Указывается как border-radius в CSS, http://htmlbook.ru/css/border-radius
				'colorButtons': '#000', // Указывается цвет
				'sensitivity': 12, // Чувствительность мышки при инерционном вращении чем меньше тем чувствительней
				"rotationModeEnabled": true,
				'useAlternativeRotation': '',
				'loaderObj': '',
				'ColorLoader': '#ff7700',
				'loader': false, // Показывает, включен Loader или нет
				'CANVAS': true,
				'imageArray': [],
				'tmpArr': [],
				'tmpArr2': [],
				'img': {},
				'imageJqObj': '',
				'imageObj': '',
				'imageId': '',
				'wrapObj': '',
				'imgDopJqObj': '',
				'imgFlag': 1,
				'imgWidth': 0,
				'imgHeight': 0,
				'flagImg2': true,
				'memPageX': 0,
				'memPageY': 0,
				'startTime': 0,
				'startPageX': 0,
				'keyDown': false,
				'frames': '',
				'rows': '',
				'imagePath': '',
				'imageName': '',
				'maxZoom': '',
				'imageLow': '',
				'imageHigh': '',
				'imagesType': 'jpg',
				'sprite': true,
				'imageCols': 0,
				'imageRows': 0,
				'imageFrames': 0,
				'frame': 1,
				'row': 1,
				'imgNum': 0,
				'toRotate': 1, // 1 - вправо , 0 - влево
				'posRotate': 1,
				'autoPlay': false,
				'zoomFlag': false,
				'minIntRotate': 100,
				'intervalRotate': 100,
				'intervalID': 0,
				'loadErrorTime': 0,
				'imgOffsetX1': 0,
				'imgOffsetY1': 0,
				'imgOffsetX2': 0,
				'imgOffsetY2': 0,
				'imgX1': 0,
				'imgY1': 0,
				'imgX2': 0,
				'imgY2': 0,
				'canvasObj': '',
				'canvasContext': '',
				'canOffX': 0,
				'canOffY': 0,
				'canWidth': 0,
				'canHeight': 0,
				'zoom': 10,
				'zoomStep': 0,
				'radiusArr': ["5px", "10px", "20px", "30px", "5px 20px", "20px 5px"],
				'radiusN': 0,
				'colorArr': ["a00", "0a0", "00a", "aa0", "a0a", "0aa", "000"],
				'colorN': 0,
				'PANELS': [
					[
						["horizon", "bottom", "center"],
						["3d", "backward", "stop", "forward", "expand"],
						"main-control-panel"
					],
					[
						["vertical", "top", "right"],
						["plus", "minus", "scissors", "paint-format"]
					]
				],
				'buttonsKit': 1,
				'autoDisableRotationalMode': '',
				'BUTTONS': {
					"1": {
						//"NAME"         : ["NUM","FUNCTION","TITLE"],
						"expand": ["e60c", "fullscreen", "Fullscreen"],
						"contract": ["e60d", "fullscreen", "Exit fullscreen"],
						"backward": ["e615", "backwardRotate", "Backward"],
						"forward": ["e61a", "forwardRotate", "Forward"],
						"play": ["e60b", "", "Play"],
						"stop": ["e60a", "stopRotate", "Stop"],
						"minus": ["e603", "minusSize", "Minus"],
						"plus": ["e604", "plusSize", "Plus"],
						"up": ["e616", "rowUp", "Up"],
						"down": ["e619", "rowDown", "Down"],
						"scissors": ["e617", "radiusKey", "Radius"],
						"paint-format": ["e600", "colorKey", "Color"],
						"3d": ["e613", "move3d", "<- 360 ->"],
						"move": ["e612", "move3d", "<- move ->"]
					},
					"2": {
						//"NAME"         : ["NUM","FUNCTION","TITLE"],
						"expand": ["e60e", "fullscreen", "Fullscreen"],
						"contract": ["e60f", "fullscreen", "Exit fullscreen"],
						"backward": ["e605", "backwardRotate", "Backward"],
						"forward": ["e608", "forwardRotate", "Forward"],
						"play": ["e601", "", "Play"],
						"stop": ["e602", "stopRotate", "Stop"],
						"minus": ["e611", "minusSize", "Minus"],
						"plus": ["e610", "plusSize", "Plus"],
						"up": ["e606", "rowUp", "Up"],
						"down": ["e607", "rowDown", "Down"],
						"scissors": ["e609", "radiusKey", "Radius"],
						"paint-format": ["e618", "colorKey", "Color"],
						"3d": ["e613", "move3d", "<- 360 ->"],
						"move": ["e612", "move3d", "<- move ->"]
					}
				}

			}, options);

			var zoomController = new ZoomController();

			start(set.imgWidth, set.imgHeight);

			function start(w, h) {

				// Вычисление шага зума
				if (set.zoomStep < 1 && set.maxZoom > 100)
					set.zoomStep = Math.round((set.imgWidth / 100 * set.maxZoom - set.imgWidth) / set.zoom);
				//if (set.zoomStep < 1) set.zoomStep = 10;
				//alert(set.zoomStep)

				var smallClass = '';
				if (w <= 400 || h <= 300)
					smallClass = ' small';

				set.imageJqObj.wrap('<span id="top-' + set.imageId + '" class="wrapper--top' + smallClass + '"></span>');
				$('#top-' + set.imageId).css({
					width: '100%',
					height: '100%'
				}).disableSelection();
				set.imageJqObj.wrap('<div id="wrap-' + set.imageId + '" class="wrapper--3d"></div>');
				set.wrapObj = $('#wrap-' + set.imageId);
				set.wrapObj.disableSelection();
				set.loaderObj = initCanvasLoader(set.wrapObj);
				startLoader();
				if ('\v' === 'v' && !document.createElement('canvas').getContext /*|| !set.sprite*/) {
					document.execCommand("BackgroundImageCache", false, true);
					set.CANVAS = false;
					set.imageJqObj.wrap('<div id="hidden-' + set.imageId + '" class="wrapper--hidden"></div>');
					$('#hidden-' + set.imageId).css({
						width: w + 'px',
						height: h + 'px',
						left: "50%",
						marginLeft: w * -0.5 + "px",
						top: "50%",
						marginTop: h * -0.5 + "px",
						position: "absolute",
						overflow: "hidden"
					}).disableSelection();
					set.imageJqObj.css({
						position: "absolute"
					});
					set.imgDopJqObj = $("<img/>").insertAfter(set.imageJqObj);
				} else {
					set.imageJqObj.wrap('<canvas id="canvas-' + set.imageId + '" width="' + w + '" height="' + h + '"></canvas>');
					set.canvasObj = document.getElementById('canvas-' + set.imageId);
					set.canvasContext = set.canvasObj.getContext('2d');
					set.canvasContext.drawImage(set.imageObj, 0, 0, w, h);
					var canJqObj = $(set.canvasObj);
					canJqObj.css({
						left: "50%",
						marginLeft: set.canvasObj.width * -0.5 + "px",
						top: "50%",
						marginTop: set.canvasObj.height * -0.5 + "px"
					});
				}
				var wrapPanel = $('<div class = "wrapper--panel"></div>').appendTo(set.wrapObj);

				function newPanel(wrap, type, addClass) { // type = horizon || vertical
					if (addClass !== '' && addClass !== null && typeof (addClass) !== 'undefined')
						addClass = ' ' + addClass;
					else addClass = '';

					return $('<div class = "icon--panel ip--' + type + addClass + '"></div>').appendTo(wrap);
				}

				function newKey(wrap, type, fun, title) { // type = &#xe615; . . .
					var key = $('<a id="' + fun + '-' + set.imageId + '" title="' + title + '">&#x' + type + ';</a>')
					key.css({
						background: set.colorButtons,
						borderRadius: set.formButtons
					})
						.on('touchstart mousedown', function () {
							set.keyDown = true;
							key.css({
								color: "#f70",
								border: "1px solid #f70"
							})
						})
						.on('mouseup mouseout touchend touchcancel', function () {
							set.keyDown = false;
							key.css({
								color: "",
								border: ""
							})
						})
						.appendTo(wrap);
					if (fun !== '') {
						key.on('click', {
							key: key
						}, eval(fun));
					}
				}

				for (var p = 0; p < set.PANELS.length; p++) {
					// Создаем панель для кнопок
					var addClass = "";
					if (set.PANELS[p].length > 2 && typeof (set.PANELS[p][2]) !== 'undefined')
						addClass = set.PANELS[p][2];
					var panel = newPanel(wrapPanel, set.PANELS[p][0][0], addClass);
					var bKit = set.buttonsKit;
					// Создаем кнопки
					for (var k = 0; k < set.PANELS[p][1].length; k++) {
						var properties = set.BUTTONS[bKit][set.PANELS[p][1][k]];
						if (typeof (properties) !== "undefined" && properties !== '') newKey(panel, properties[0], properties[1], properties[2]);
					}
					// Выравниваем панель
					for (var i = 1; i < set.PANELS[p][0].length; i++) {
						if (set.PANELS[p][0][i] === "bottom")
							panel.css({
								top: "100%",
								marginTop: "-" + panel.outerHeight() + "px"
							}); // bottom
						else if (set.PANELS[p][0][i] === "center") {
							aaw = $('.icon--panel a').outerWidth();
							plw = panel.outerWidth()
							panel.css({
								left: "50%",
								marginLeft: panel.outerWidth() * -0.5 + "px",
								width: plw
							}); // center
						} else if (set.PANELS[p][0][i] === "right")
							panel.css({
								left: "100%",
								marginLeft: panel.outerWidth() * -1 + "px"
							}); // right
					}
				}
				// Делаем кнопку не активной
				setChangeModeButtonActive(false);
				//
				// загружаем первое изображение
				set.sprite ? newImgLoad(1) : newImagesLoad(1);
				//
				// Отлавливаем зум колесиком мыши
				set.wrapObj.mousewheel(function (event, delta, deltaX, deltaY) {
					if (set.maxZoom > 100 && set.zoomFlag && delta !== 0) zoommer(delta);
					if (set.maxZoom > 100 && set.flagImg2 && delta > 0) {
						set.flagImg2 = false;
						set.sprite ? newImgLoad(2) : newImagesLoad(2);
					}
					event.stopPropagation();
					event.preventDefault();
				});

				set.wrapObj.on('touchstart mousedown', mouseDown); //touchstart touchmove touchend touchcancel
				//set.wrapObj.on('mousemove', mouseMove2);
				set.wrapObj.on('mouseup touchend touchcancel', mouseUp); //touchstart touchmove touchend touchcancel

				new ResizeSensor(set.wrapObj, function () {
					zoomController.setMinZoom();
				});

				zoomController.setZoomWithoutRedraw(zoomController.getMinZoom()); //Инициализация размеров
			}

			/* Костыльный механизм масштабирования, построенный поверх параметров старого.
			   Должен решать проблемы старого и иметь более прозрачную логику.
			*/
			function ZoomController() {
				/* Масштаб относительно исходного изображения */
				this.currentZoom = 1;

				/*Если я правильно понимаю, таким образом сохранится исходный размер изображения*/
				this.initialImgWidth = set.imgWidth;
				this.initialImgHeight = set.imgHeight;

				/* Возвращает максимально допустимый масштаб изображения (задан при генерации). */
				this.getMaxZoom = function maxZoom() {
					return Math.max(set.maxZoom / 100, 1);
				};

				/* Возвращает минимальный допустимый масштаб - такой масштаб, при котором все изображение видимо полностью. */
				this.getMinZoom = function () {
					var wow = set.wrapObj.width();
					var iiw = this.initialImgWidth;

					var woh = set.wrapObj.height();
					var iih = this.initialImgHeight;

					return Math.min(wow / iiw, woh / iih, 1);
				};

				/* Устанавливает заданный масштаб, если он в допустимом диапазоне.
				   Если заданный масштаб выходит за границы, устанавливается ближайший допустимый.
				   Не перерисовывает изображение, только устанавливает размеры.*/
				this.setZoomWithoutRedraw = function (newZoom) {
					var maxZoom = this.getMaxZoom();
					var minZoom = this.getMinZoom();

					if (newZoom > maxZoom)
						newZoom = maxZoom;
					if (newZoom < minZoom)
						newZoom = minZoom;

					var imgRatio = this.initialImgWidth / this.initialImgHeight;

					if (set.CANVAS) {
						set.canWidth = this.initialImgWidth * newZoom;
						set.canHeight = set.canWidth / imgRatio;

						set.canvasObj.width = set.canWidth;
						set.canvasObj.height = set.canHeight;
						set.canvasObj.style.marginLeft = set.canWidth * -0.5 + "px";
						set.canvasObj.style.marginTop = set.canHeight * -0.5 + "px";

						fitImageToBounds(); //Необходимо, чтобы при масштабировании изображение не вылетало за границы плеера
					} else {
						set.imgWidth = this.initialImgWidth * newZoom;
						set.imgHeight = Math.round(set.imgWidth / imgRatio);
					}

					this.currentZoom = newZoom;
				};

				/* Устанавливает заданный масштаб, если он в допустимом диапазоне.
				   Если заданный масштаб выходит за границы, устанавливается ближайший допустимый.*/
				this.setZoom = function (newZoom) {
					this.setZoomWithoutRedraw(newZoom);

					if (set.CANVAS) {
						var pos = position();
						drawImage(pos);
						offSet0();
					} else {
						newSize();
					}

					this.currentZoom = newZoom;
				};

				/* Группа функций, устанавливающих стандартные значения масштаба. */
				this.setMinZoom = function () {
					this.setZoom(this.getMinZoom());
				};
				this.setMaxZoom = function () {
					this.setZoom(this.getMaxZoom());
				};

				/* Устанавливает такой масштаб, что ширина итогового изображения будет больше на заданное количество пикселей. */
				this.addZoomPixels = function (additionalWidth) {
					var currentWidth = set.CANVAS ? set.canWidth : set.imgWidth;
					var newZoom = (currentWidth + additionalWidth) / this.initialImgWidth;
					this.setZoom(newZoom);
				};
			}

			function move3d(event) {

				var key = $("#move3d-" + set.imageId); //event.data.key;
				var bKit = set.buttonsKit;
				var butt3d = set.BUTTONS[bKit]["3d"];
				var buttMove = set.BUTTONS[bKit]["move"];

				if (set.rotationModeEnabled) {

					if (!isMoveModeAllowed())
						return; //Костыль, чтобы выключенная кнопка не действовала

					key.html("&#x" + butt3d[0] + ";").attr({
						title: butt3d[2]
					});

					if (set.autoPlay)
						stopRotate();

				} else {

					key.html("&#x" + buttMove[0] + ";").attr({
						title: buttMove[2]
					});
				}

				set.rotationModeEnabled = !set.rotationModeEnabled;
			}

			function rotationImg() {
				moment();
				clearInterval(set.intervalID);
				if (set.autoPlay) {
					set.toRotate ? ++set.frame : --set.frame;
					set.intervalID = setTimeout(rotationImg, set.intervalRotate);
				}
				var pos = position();
				if (set.sprite) {
					if (set.CANVAS) {
						drawImage(pos);
					} else {
						if (set.imgFlag) {
							obj1 = set.imageJqObj[0];
							obj2 = set.imgDopJqObj[0];
							set.imgFlag = 0;
						} else {
							obj2 = set.imageJqObj[0];
							obj1 = set.imgDopJqObj[0];
							set.imgFlag = 1;
						}
						// Ухищьрения для IE меньше 8
						obj1.style.display = ''; // Показываем 1 объект
						obj2.style.display = 'none'; // Скрываем второй объект
						obj1.style.left = pos[0]; // Теперь есть много времени, что бы передвинуть невидимый объект
						obj1.style.top = pos[1];
					}
				} else {
					drawImage(pos);
				}
			}

			function newImagesLoad(num) {
				startLoader();
				if (num === 1) {
					var myArray = set.tmpArr,
						errorTime = 10000,
						dirimg = set.imagePath + set.imageName + '100.';
				} else if (num === 2) {
					var myArray = set.tmpArr2,
						errorTime = 30000,
						dirimg = set.imagePath + set.imageName + set.maxZoom + '.';
				}
				set.loadErrorTime = setTimeout(function () {
					newImagesLoad(num)
				}, errorTime);
				var loadMem = 0,
					x = 1,
					y = 1;
				for (var y = 1; y <= set.rows; y++) {
					myArray[y] = [];
					var z = set.frames;
					var w = 0;
					for (var x = 1; x <= set.frames; x++) {
						myArray[y][x] = new Image();
						myArray[y][x].setAttribute('data-x', x);
						myArray[y][x].setAttribute('data-y', y);
						if (set.rows === 1 && set.trendCorrect === 0)
							myArray[y][x].src = dirimg + (w++) + '.' + set.imagesType;
						else if (set.rows === 1 && set.trendCorrect === 1)
							myArray[y][x].src = dirimg + (--z) + '.' + set.imagesType;
						else
							myArray[y][x].src = dirimg + (--z) + '.' + (y - 1) + '.' + set.imagesType;
						if (!ie() || ie() > 8) {
							if (myArray[y][x].readyState === 'complete' || myArray[y][x].readyState === 'loaded') load();
							myArray[y][x].onload = load;
							myArray[y][x].onreadystatechange = load; //  IE
						}
					}
				}
				// Для IE меньше 9
				if (ie() && ie() < 9) {
					set.imageArray = myArray;
					if (set.autoPlay) rotationImg();
					set.zoomFlag = true;
					stopLoader();
					clearTimeout(set.loadErrorTime);
				}

				function load() {
					if (num === 1) {
						if (++loadMem === set.frames * set.rows) {
							clearTimeout(set.loadErrorTime);
							set.imageArray = set.tmpArr;
							setTimeout(function () {
								if (set.autoPlay) rotationImg();
								set.zoomFlag = true;
								stopLoader();
							}, 100);
							loadMem = 0;
						}
					}
					else if (num === 2) {
						y = this.getAttribute('data-y');
						x = this.getAttribute('data-x');
						if (++loadMem === set.frames * set.rows) setTimeout(function () {
							set.imageArray = set.tmpArr2;
							set.tmpArr = [];
							clearTimeout(set.loadErrorTime);
							stopLoader();
						}, 100);
						setTimeout(function () {
							imageArray(y, x);
						}, 0);
					}
				}
			}

			function imageArray(y, x) {
				var imgO = set.tmpArr2[y][x];
				if (typeof (imgO) !== "undefined") set.imageArray[y][x] = imgO;
			}

			function newImgLoad(num) {
				startLoader();
				if (num === 1) lnk = set.imageLow;
				else if (num === 2) lnk = set.imageHigh;
				var img = new Image();
				img.src = lnk;
				if (img.readyState === 'complete' || img.readyState === 'loaded') load();
				img.onload = load;
				img.onreadystatechange = load; //  IE
				function load() {
					if (set.imageCols === 0) set.imageCols = Math.round(img.width / set.imgWidth);
					if (set.imageRows === 0) set.imageRows = Math.round(img.height / set.imgHeight);
					var cols = set.imageCols;
					var rows = set.imageRows;
					var ifrs = set.imageFrames;
					if (set.CANVAS) {
						set.imageObj = img;
						set.imgWidth = img.width / cols;
						set.imgHeight = img.height / rows;
					} else {
						w = set.imgWidth;
						h = set.imgHeight;
						iw = w * cols;
						ih = h * rows;
						set.imgDopJqObj[0].src = lnk;
						set.imgDopJqObj.css({
							position: "absolute",
							width: iw + "px",
							height: ih + "px"
						}); //
						set.imageJqObj[0].src = lnk;
						set.imageJqObj.css({
							position: "absolute",
							display: "none",
							width: iw + "px",
							height: ih + "px"
						})
					}
					newSize();
					if (set.autoPlay) rotationImg();
					set.zoomFlag = true;
					setTimeout(stopLoader, 100);
				}
			}

			function mouseDown(event) {
				if (!set.keyDown) {

					if (typeof (event.originalEvent.touches) !== "undefined" || typeof (event.originalEvent.changedTouches) !== "undefined") {
						var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
					}
					var eX = event.pageX || touch.pageX;
					var eY = event.pageY || touch.pageY;

					if (set.rotationModeEnabled) {

						set.wrapObj.on('mousemove touchmove', mouseMove); //touchstart touchmove touchend touchcancel

						stopRotate();

						set.startTime = new Date; // засекли время
						set.startPageX = eX;
						set.memPageX = eX;
						set.memPageY = eY;
						event.stopPropagation();
						event.preventDefault();

					} else {

						set.memPageX = eX;
						set.memPageY = eY;

						set.wrapObj.on('mousemove touchmove', mouseMove2);
					}
				}
			}

			function moment() {
				var p = 0;
				if (set.intervalRotate < set.minIntRotate) {
					var proc = set.intervalRotate / set.minIntRotate * 100;
					if (proc < 25) p = 0.25;
					else if (proc > 25 && proc < 50) p = 0.5;
					else if (proc > 50 && proc < 75) p = 0.75;
					else if (proc > 75) p = 1.0;
					set.intervalRotate = set.intervalRotate + p;
				} else if (set.intervalRotate > set.minIntRotate) {
					set.intervalRotate = set.minIntRotate;
				}
			}

			function mouseUp() {

				set.wrapObj.unbind('mousemove touchmove', mouseMove2);
				set.wrapObj.unbind('mousemove touchmove', mouseMove); //touchstart touchmove touchend touchcancel

				if (set.rotationModeEnabled) { //Предотвращает включение вращения в режиме перетаскивания
					var time = new Date - set.startTime;
					var step = 0;
					if (set.memPageX > set.startPageX)
						step = (set.memPageX - set.startPageX) / 10;
					else if (set.memPageX < set.startPageX)
						step = (set.startPageX - set.memPageX) / 10;

					if (step > set.sensitivity) {
						set.intervalRotate = time / step;
						if (!set.autoPlay) {
							set.autoPlay = true;
							rotationImg();
						}
					}
				}
			}

			function mouseMove(event) {
				if (typeof (event.originalEvent.touches) !== "undefined" || typeof (event.originalEvent.changedTouches) !== "undefined") {
					var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
				}
				var eX = event.pageX || touch.pageX;
				var eY = event.pageY || touch.pageY;
				var c = 1 + zoomController.currentZoom / 15.0;
				var barrier = 10 * c;

				var rotateForward = function () {
					++set.frame;
					set.toRotate = 1;
					rotationImg();
					set.memPageX = eX;
				};

				var rotateBackward = function () {
					--set.frame;
					set.toRotate = 0;
					rotationImg();
					set.memPageX = eX;
				};


				if ((eX - set.memPageX) > barrier) {
					if (set.useAlternativeRotation)
						rotateBackward();
					else
						rotateForward();
				} else if ((set.memPageX - eX) > barrier) {
					if (set.useAlternativeRotation)
						rotateForward();
					else
						rotateBackward();
				}
				if ((eY - set.memPageY) > barrier) {
					rowDown();
					set.memPageY = eY;
				} else if ((set.memPageY - eY) > barrier) {
					rowUp();
					set.memPageY = eY;
				}
				//$('#inf').text('pageX: '+eX);
				event.stopPropagation();
				event.preventDefault();
			}

			function mouseMove2(event) {
				if (typeof (event.originalEvent.touches) !== "undefined" || typeof (event.originalEvent.changedTouches) !== "undefined") {
					var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
				}
				var eX = event.pageX || touch.pageX;
				var eY = event.pageY || touch.pageY;

				var xDelta = eX - set.memPageX;
				var yDelta = eY - set.memPageY;
				var factor = 1;
				set.canOffX += xDelta * factor;
				set.canOffY += yDelta * factor;

				fitImageToBounds();

				set.memPageX = eX;
				set.memPageY = eY;
				drawImage(position());
			}

			/* Проверяет, находится ли изображение на недопустимой позиции и сдвигает его на ближайшую допустимую. */
			function fitImageToBounds() {
				var canvObj = $('#canvas-' + set.imageId);
				var wrpObj = set.wrapObj;
				var canvasW = canvObj.width();
				var canvasH = canvObj.height();
				var wrapW = wrpObj.width();
				var wrapH = wrpObj.height();
				var maxLeft = Math.max((canvasW - wrapW) / 2, 0);
				var maxTop = Math.max((canvasH - wrapH) / 2, 0);

				if (set.canOffX < -maxLeft)
					set.canOffX = -maxLeft;
				if (set.canOffX > maxLeft)
					set.canOffX = maxLeft;

				if (set.canOffY < -maxTop)
					set.canOffY = -maxTop;
				if (set.canOffY > maxTop)
					set.canOffY = maxTop;
			}

			function offSet0() {
				if (isMoveModeAllowed()) {
					setChangeModeButtonActive(true);

					if (set.autoDisableRotationalMode && set.rotationModeEnabled)
						move3d();
				} else {
					set.canOffX = 0;
					set.canOffY = 0;
					drawImage(position());
					// Делаем кнопку не активной
					setChangeModeButtonActive(false);

					set.rotationModeEnabled = false;
					move3d();
				}
			}

			function setChangeModeButtonActive(active) {
				if (active) {
					$("#move3d-" + set.imageId).removeAttr("class");
				}
				else {
					$("#move3d-" + set.imageId).attr("class", "not--active");
				}
			}

			function isMoveModeAllowed() {
				var canid = $('#canvas-' + set.imageId);
				var canw = canid.width();
				var canh = canid.height();
				var wrow = set.wrapObj.width();
				var wroh = set.wrapObj.height();

				return canw > wrow || canh > wroh;
			}

			function rowUp() {
				--set.row;
				if (set.row > set.rows) set.row = set.rows;
				else if (set.row < 1) set.row = 1;
				drawImage(position());
			}

			function rowDown() {
				++set.row;
				if (set.row > set.rows) set.row = set.rows;
				else if (set.row < 1) set.row = 1;
				drawImage(position());
			}

			function startRotate() {
				if (!set.autoPlay) {
					if (!set.rotationModeEnabled)
						move3d();

					set.autoPlay = true;
					rotationImg();
				}
			}

			function stopRotate() {
				set.intervalRotate = set.minIntRotate;

				set.memPageX = set.startPageX;
				//Фикс бага, связанного с тем, что при нажатии на кнопку stop срабатывает mouseUp, но не срабатывает mouseDown

				if (set.autoPlay) {
					clearInterval(set.intervalID);
					set.intervalID = 0;
					set.autoPlay = false;
				}
			}

			function forwardRotate(kid) {
				if (set.autoDisableRotationalMode && !set.rotationModeEnabled) {
					zoomController.setMinZoom();
				}

				set.toRotate = 1;
				startRotate();
			}

			function backwardRotate(kid) {
				if (set.autoDisableRotationalMode && !set.rotationModeEnabled) {
					zoomController.setMinZoom();
				}

				set.toRotate = 0;
				startRotate();
			}

			function plusSize() {
				if (set.zoomFlag) zoommer(1);
				if (set.flagImg2) {
					set.flagImg2 = false;
					set.sprite ? newImgLoad(2) : newImagesLoad(2);
				}
			}

			function minusSize() {
				if (set.zoomFlag) zoommer(-1);
			}

			function position() {
				if (set.sprite) {
					if (set.frame > set.imageFrames) set.frame = 1;
					else if (set.frame < 1) set.frame = set.imageFrames;
					return set.imageArray[set.frame - 1];
				} else {
					if (set.frame > set.frames) set.frame = 1;
					else if (set.frame < 1) set.frame = set.frames;
					return set.imageArray[set.row][set.frame];
				}
			}

			function drawImage(pos) {
				var w = set.imgWidth;
				var h = set.imgHeight;
				if (set.sprite) {
					set.canvasContext.drawImage(set.imageObj, pos[0], pos[1], w, h, set.canOffX, set.canOffY, set.canWidth, set.canHeight);
				} else if (set.CANVAS) {
					set.canvasContext.drawImage(pos, 0, 0, pos.width, pos.height, set.canOffX, set.canOffY, set.canWidth, set.canHeight);
				} else {
					if (pos !== undefined) {
						set.imageJqObj[0].src = pos.src;
						set.imageJqObj.css({
							display: "block",
							position: "absolute",
							left: 0,
							top: 0,
							width: w + "px",
							height: h + "px"
						});
					}
				}
			}

			function zoommer(delta) {

				var zstep = set.zoomStep; // размер шага зума
				if (delta > 0)
					zoomController.addZoomPixels(zstep);
				else
					zoomController.addZoomPixels(-zstep);
			}

			function zoommerFullScreen(delta) {
				//if (set.CANVAS) offSet0();

				// Делаем кнопку не активной
				setChangeModeButtonActive(false);
				set.rotationModeEnabled = false;
				move3d();

				if (set.flagImg2 && delta > 0) {
					set.flagImg2 = false;
					set.sprite ? newImgLoad(2) : newImagesLoad(2);
				}

				zoomController.setMinZoom();
				setTimeout(nifs, 100);
			}

			function nifs() {
				if (set.loader) setTimeout(nifs, 100);
				else {
					if (set.CANVAS) {
						pos = position();
						drawImage(pos);
					} else {
						newSize();
					}
				}

			}

			function newSize() {
				w = set.imgWidth;
				h = set.imgHeight;
				if (set.sprite) {
					var cols = set.imageCols;
					var rows = set.imageRows
					var ifrs = set.imageFrames;
					iw = w * cols;
					ih = h * rows;
					tmpArr = [];
					var z = 0;
					for (var y = 0; y < rows; y++) {
						for (var x = 0; x < cols; x++) {
							if (set.CANVAS) {
								pw = x * w;
								ph = y * h;
							} else {
								pw = x * w * -1 + "px";
								ph = y * h * -1 + "px";
							}
							tmpArr[z] = [pw, ph];
							if (++z === ifrs) break;
						}
					}
					set.imageArray = tmpArr;
					pos = position();
					if (set.CANVAS) {
						drawImage(pos);
					} else {
						obj = set.imgDopJqObj[0];
						obj.style.width = iw + "px";
						obj.style.height = ih + "px";
						obj.style.left = pos[0];
						obj.style.top = pos[1];
						obj = set.imageJqObj[0];
						obj.style.width = iw + "px";
						obj.style.height = ih + "px";
						obj.style.left = pos[0];
						obj.style.top = pos[1];
						$('#hidden-' + set.imageId).css({
							width: w + 'px',
							height: h + 'px',
							left: "50%",
							marginLeft: w * -0.5 + "px",
							top: "50%",
							marginTop: h * -0.5 + "px"
						});
					}
				} else {
					set.imageJqObj.css({
						display: "block",
						position: "absolute",
						left: 0,
						top: 0,
						width: w + "px",
						height: h + "px"
					});
					$('#hidden-' + set.imageId).css({
						width: w + 'px',
						height: h + 'px',
						left: "50%",
						marginLeft: w * -0.5 + "px",
						top: "50%",
						marginTop: h * -0.5 + "px"
					});
				}
			}

			// Функция закругления кнопок
			function radiusKey(kid) {
				$(".icon--panel a").css({
					borderRadius: set.radiusArr[set.radiusN]
				});
				if (++set.radiusN > 5) set.radiusN = 0;
			}

			// Функция изменения цвета кнопок
			function colorKey(kid) {
				$(".icon--panel a").css({
					background: "#" + set.colorArr[set.colorN]
				});
				if (++set.colorN > 6) set.colorN = 0;
			}

			function fullscreen(event) {

				if (!set.zoomFlag) return; // Запрет fullscreen, если не загрузилось первое изображение.

				var key = event.data.key;
				set.canOffX = 0;
				set.canOffY = 0;
				if (ie() > 7 || !ie()) {
					var bKit = set.buttonsKit;
					var buttExpand = set.BUTTONS[bKit]["expand"];
					var buttContract = set.BUTTONS[bKit]["contract"];
					var obj = set.wrapObj;
					if ($.fullscreen.isFullScreen()) {
						//для IE
						if (ie()) {
							key.html("&#x" + buttExpand[0] + ";").attr({
								title: buttExpand[2]
							});
						}
						$.fullscreen.exit();
						zoommerFullScreen(-1);

						if (device.ios())
							$(".main-control-panel", $(obj)).removeClass("ios-top");

					} else {
						//для IE
						if (ie()) {
							key.html("&#x" + buttContract[0] + ";").attr({
								title: buttContract[2]
							});
						}

						obj.fullscreen();
						zoommerFullScreen(1);

						if (device.ios())
							$(".main-control-panel", $(obj)).addClass("ios-top");

					}

					$(document).on('fscreenchange', function (e, state, elem) {
						if ($.fullscreen.isFullScreen()) {
							key.html("&#x" + buttContract[0] + ";").attr({
								title: buttContract[2]
							});
							//zoommerFullScreen(1);
						} else {
							key.html("&#x" + buttExpand[0] + ";").attr({
								title: buttExpand[2]
							});
							zoommerFullScreen(-1);
						}
					});
					//для IE
					if (ie()) {
						$(window).keydown(function (e) {
							if (e.keyCode = 27) {
								key.html("&#x" + buttExpand[0] + ";").attr({
									title: buttExpand[2]
								});
								zoommerFullScreen(-1);
							}
						});
					}
				} else alert("You have deprecated version of Internet Explorer browser. Full screen mode is not supported.");
			}

			function initCanvasLoader(jqObj) {
				var wrpObj = $("<div/>", {
					//id      : "wrapperCanvasLoader",
				})
					.css({
						position: "absolute",
						left: "50%",
						top: "50%"
					})
					.appendTo(jqObj);
				var cl = new CanvasLoader(wrpObj[0]); //"wrapperCanvasLoader");
				cl.setColor(set.ColorLoader); // default is '#000000'
				cl.setShape('roundRect'); // default is 'oval'
				cl.setDiameter(100); // default is 40
				cl.setDensity(10); // default is 40
				cl.setRange(1); // default is 1.3
				cl.setSpeed(1); // default is 2
				cl.setFPS(10); // default is 24
				//cl.show(); // Hidden by default
				var offset = cl.getDiameter() * -0.5 + "px";
				$(".canvasLoader").css("margin", offset + " 0 0 " + offset);
				return cl;
			}

			function startLoader() {
				set.loader = true;
				set.loaderObj.show();
			}

			function stopLoader() {
				set.loaderObj.hide();
				set.loader = false;
			}

			function ie() {
				var uagent = navigator.userAgent;
				var uaOF = uagent.indexOf("MSIE");
				if (uaOF === -1) uaOF = uagent.indexOf("Trident");
				if (uaOF !== -1) {
					var vers = uagent.substr(uaOF + 5, 2);
					parseInt(vers) ? res = parseInt(vers) : res = 100;
					return res;
				} else return false;
			}
		}
	};
	$.fn.Photo3D = function (method) {
		// логика вызова метода
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метод с именем ' + method + ' не существует для jQuery.Photo3D');
		}
	};
})(jQuery);