const template = document.createElement('template');
template.innerHTML = `
    <!-- import CSS -->
    <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
    <!-- <link rel="stylesheet" href="../slider.css"> -->
    <div role="slider" aria-valuemin="0" aria-valuemax="100" aria-orientation="horizontal" class="el-slider" aria-valuetext="0" aria-label="slider between 0 and 100">
        <div class="el-slider__runway">
            <div class="el-slider__bar" style="left: 0%;"></div>
            
            <div tabindex="0" class="el-slider__button-wrapper">
                <div class="el-tooltip el-slider__button" aria-describedby="el-tooltip-9861" tabindex="0"></div>
            
            </div>
        </div>
    </div>
  `;

class VanillaSliderV2 extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.appendChild(template.content.cloneNode(true));

        this.sliderContainer = this.root.querySelector('.el-slider');
        this.sliderRunway = this.root.querySelector('.el-slider__runway');
        this.sliderBar = this.root.querySelector('.el-slider__bar');
        this.sliderBtnWrapper = this.root.querySelector('.el-slider__button-wrapper');
        this.tootip = this.root.querySelector('.el-tooltip.el-slider__button');

        // Bind the "this" to the functions
        this.getCurrentPosition = this.getCurrentPosition.bind(this);
        this.setInitPosition = this.setInitPosition.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.onSliderClick = this.onSliderClick.bind(this);

        this.onButtonDown = this.onButtonDown.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragging = this.onDragging.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    connectedCallback() {
        // Bind event listener to sliderbar whenever it is clicked

        this.sliderRunway.addEventListener('mousedown', this.onSliderClick);
        this.sliderBtnWrapper.addEventListener('mousedown', this.onButtonDown);

        if (this.hasAttribute('value')) {
            this._value = this.getAttribute('value');
        }
        if (this.hasAttribute('min')) {
            this.min = this.getAttribute('min');
        }
        if (this.hasAttribute('max')) {
            this.max = this.getAttribute('max');
        }

        this.setInitPosition();
    }

    getCurrentPosition() {
        return (this._value - this.min) / (this.max - this.min) * 100 + "%";
    }

    setInitPosition() {
        const percent = (this._value - this.min) / (this.max - this.min) * 100;
        // console.log("Initial percentage: " + Math.round(percent) + "%");
        // set sliderBar width
        this.sliderBar.style.width = percent + "%";
        // set sliderBtn offset
        this.sliderBtnWrapper.style.left = percent + "%";
    }

    setPosition(percent) {
        const targetValue = parseInt(this.min) + percent * (this.max - this.min) / 100;
        this._value = targetValue;
        // console.log("New value: " + Math.round(targetValue));
        // console.log("New percentage: " + Math.round(percent) + "%");
        // set sliderBar width
        this.sliderBar.style.width = percent + "%";
        // set sliderBtn offset
        this.sliderBtnWrapper.style.left = percent + "%";
    }

    onSliderClick(event) {
        // if (this.sliderDisabled || this.dragging) return;
        this.sliderSize = this.sliderContainer.clientWidth;
        const sliderOffsetLeft = this.sliderContainer.getBoundingClientRect().left;
        this.setPosition((event.clientX - sliderOffsetLeft) / this.sliderSize * 100);
        this.onButtonDown(event);
    }

    onButtonDown(event) {
        if (this.disabled) return;
        event.preventDefault();
        this.onDragStart(event);
        window.addEventListener('mousemove', this.onDragging);
        window.addEventListener('touchmove', this.onDragging);
        window.addEventListener('mouseup', this.onDragEnd);
        window.addEventListener('touchend', this.onDragEnd);
        window.addEventListener('contextmenu', this.onDragEnd);
    };

    onDragStart(event) {
        this.dragging = true;
        this.isClick = true;
        if (event.type === 'touchstart') {
            event.clientX = event.touches[0].clientX;
        }
        this.startX = event.clientX;
        this.startPosition = parseFloat(this.getCurrentPosition());
        this.newPosition = this.startPosition;
    };

    onDragging(event) {
        if (this.dragging) {
            this.isClick = false;
            // this.displayTooltip();
            let diff = 0;
            if (event.type === 'touchmove') {
                event.clientX = event.touches[0].clientX;
            }
            this.currentX = event.clientX;
            diff = (this.currentX - this.startX) / this.sliderSize * 100;
            this.newPosition = this.startPosition + diff;
            this.setPosition(this.newPosition);
        }
    }

    onDragEnd() {
        if (this.dragging) {
            setTimeout(() => {
                this.dragging = false;
                // this.hideTooltip();
                if (!this.isClick) {
                    this.setPosition(this.newPosition);
                }
            }, 0);
            window.removeEventListener('mousemove', this.onDragging);
            window.removeEventListener('touchmove', this.onDragging);
            window.removeEventListener('mouseup', this.onDragEnd);
            window.removeEventListener('touchend', this.onDragEnd);
            window.removeEventListener('contextmenu', this.onDragEnd);
        }
    }

    static get observedAttributes() {
        return ['value', 'min', 'max'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                // console.log(`Initial value: ${newValue}`);
                break;
            case 'min':
                // console.log(`Minimum value: ${newValue}`);
                break;
            case 'max':
                // console.log(`Maximum value: ${newValue}`);
                break;
        }
    }
}

customElements.define('vanilla-slider-v2', VanillaSliderV2);