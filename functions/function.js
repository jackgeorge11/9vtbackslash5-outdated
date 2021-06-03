const buttons = document.querySelectorAll('.btn');
const link1 = document.getElementById('link1');
const link2 = document.getElementById('link2');
const link3 = document.getElementById('link3');
const link4 = document.getElementById('link4');
const popup = document.querySelectorAll('.popup')

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  };
  return color
};

function getRandomPlacement() {
	let divNumber = Math.floor((Math.random() * 23) + 1);
	return divNumber
};

function replaceBackground() {
	document.querySelector('body').style.backgroundColor = `${getRandomColor()}aa`;
	let div1 = `#R${getRandomPlacement()}`;
	let div2 = `#R${getRandomPlacement()}`;
	let div3 = `#R${getRandomPlacement()}`;
	let div4 = `#R${getRandomPlacement()}`;
	if (div1 !== div2 && div1 !== div3 && div1 !== div4) {
		$(div1).append(link1);
	};
	if (div2 !== div1 && div2 !== div3 && div2 !== div4) {
		$(div2).append(link2);
	};
	if (div3 !== div1 && div3 !== div2 && div3 !== div4) {
		$(div3).append(link3);
	};
	if (div4 !== div1 && div4 !== div2 && div4 !== div3) {
		$(div4).append(link4);
	};
	let backslashes = document.querySelectorAll('.backslashes');
	if (backslashes !== null) {
		backslashes.forEach((pair) => {
			pair.remove()
		});
	};
};

buttons.forEach((button) => {
	button.addEventListener('click', () => {
		replaceBackground();
		if (popup !== null) {
			popup.forEach((item) => {
				item.remove();
			})
		}
	})
});

function drag(event) {
    event.dataTransfer.setData('target_id', event.target.id);
    if (popup !== null) {
			popup.forEach((item) => {
				item.remove();
			})
		}
  };

function allowDrop(event) {
	event.preventDefault();
};

function drop(event) {
	event.preventDefault();
	var drop_target = event.target;
	var drag_target_id = event.dataTransfer.getData('target_id');
	var drag_target = $('#'+drag_target_id)[0];
	var tmp = document.createElement('span');
	tmp.classname = 'hide';
	drop_target.before(tmp);
	drag_target.before(drop_target);
	tmp.replaceWith(drag_target);
	replaceBackground();
};

$(function () {
    $('.bender').arctext({
            radius: 10000
    });
    $( document ).ready(function () {
        $('.bender').arctext('set', {
            radius: 1000,
            dir: 1,
            rotate: true,
            animation: {
                speed: 10000
            }
        });
        return false
    });
});



const imgA = document.querySelectorAll('.imgA');
const imgB = document.querySelectorAll('.imgB');
const formA = document.getElementById('formA');
const formB = document.getElementById('formB');

// console.log(imgA)

if (imgA) {
	imgA.forEach((img) => {
		img.addEventListener('click', () => {
			formA.submit();
		});
	})
}

if (imgB) {
	imgB.forEach((img) => {
		img.addEventListener('click', () => {
			formB.submit();
		});
	})
}

var zoomed = (function () {
	var state = false; // Private Variable

	var pub = {};// public object - returned at end of module

	pub.changeState = function (newstate) {
		state = newstate;
	};

	pub.getState = function() {
		return state;
	}

	return pub; // expose externally
}());

// console.log(zoomed.getState());


$(function () {
	$( document ).ready(function () {
        $('#enlarge').click(() => {
			const height = $('.main').height();
			const width = $('.main').width();
			// console.log(height, width)
			if (!zoomed.getState()) {
				if (height < width) {
					$('.main').css({'height': 'auto'});
					$('#enlarge').css({ 'max-width': 'auto', 'max-height': 'auto', 'height': 'auto', 'width': '100%', 'cursor': 'zoom-out' });
				}
				// else {
				// 	$('.main').css({'width': 'auto', 'overflow': 'auto'});
				// 	$('#enlarge').css({ 'max-width': 'auto', 'max-height': 'auto', 'height': '100%', 'width': 'auto', 'cursor': 'zoom-out' });
				// }
			} else {
				$('.main').css({'height': '100%'});
				$('#enlarge').css({ 'max-width': '100%', 'max-height': '100%', 'height': 'auto', 'width': 'auto', 'cursor': 'zoom-in' });
			}
			zoomed.changeState(!zoomed.getState());
			// console.log(zoomed.getState())
		});
	});
});
