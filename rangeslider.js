class RangeSlider {
  constructor(container) {
    // Создание элементов
    this.container = container;
    if (!this.container) {
      throw new Error('Container element not found');
    }
    const options = container.dataset;
    
    this.options = {
      title: options.title ? `<div class="range-slider-title">${options.title}</div>` : '',
      name: options.rangeName || '',
      min: parseInt(options.min || 0),
      max: parseInt(options.max || 100),
      minValue: parseInt(options.minValue || options.min || 0),
      maxValue: parseInt(options.maxValue || options.max || 100),
      colors: options.colors || {bgTrackTransparent: '#C3C3C333', bgTrackFilled: '#F1984C80'},
      unit: options.unit || 'ед.',
    };
    this.render();
    this.attachEvents();
  }

  render() {
    // Создаем HTML разметку для слайдера
    const options = this.options;
    this.container.innerHTML = `
        ${options.title}
        <div class="r-current-values">
          <label>
            <span>от</span>
            <input type="number" class="input-low" value="${options.minValue}" min="${options.min}" max="${options.max}">
            <span>${options.unit}</span>
          </label>
          <label>
            <span>до</span>
            <input type="number" class="input-high" value="${options.maxValue}" min="${options.min}" max="${options.max}">
            <span>${options.unit}</span>
          </label>
        </div>
      <div class="range-slider">
        <input type="range" ${options.name ? ' name="' + options.name + '[min]'+ '"' : ''} class="range-min range-input" min="${options.min}" max="${options.max}" value="${options.minValue}" />
        <input type="range" ${options.name ? ' name="' + options.name + '[max]'+ '"' : ''} class="range-max range-input" min="${options.min}" max="${options.max}" value="${options.maxValue}" />
        <div class="range-track"></div>
      </div>
        <div class="r-labels">
          <span>Min: ${options.min}</span>
          <span>Max: ${options.max}</span>
        </div>
    `;

    this.rangeMin = this.container.querySelector('.range-min');
    this.rangeMax = this.container.querySelector('.range-max');
    this.rangeTrack = this.container.querySelector('.range-track');
    this.sliderLow = this.rangeMin;
    this.sliderHigh = this.rangeMax;
    this.inputLow = this.container.querySelector('.input-low');
    this.inputHigh = this.container.querySelector('.input-high');

    this.updateTrack();
  }

  attachEvents() {

    const updateInputs = () => {
      let low = parseInt(this.inputLow.value), high = this.inputHigh.value;
      if (low > high) low = high;
      if (low < this.options.min) low = this.options.min;
      if (high < low) high = low;
      console.log([high, this.options]);
      if (high > this.options.max) high = this.options.max;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout( () => {
        this.sliderLow.value = low;
        this.sliderHigh.value = high;
        this.inputLow.value = low;
        this.inputHigh.value = high;
        this.updateTrack(false);
      }, 1000 );
    };

    this.rangeMin.addEventListener('input', () => this.updateTrack());
    this.rangeMax.addEventListener('input', () => this.updateTrack());
    this.inputLow.addEventListener('input', updateInputs);
    this.inputHigh.addEventListener('input', updateInputs);

  }

  updateTrack(update_inputs = true) {
    const minValue = parseInt(this.rangeMin.value);
    const maxValue = parseInt(this.rangeMax.value);
    if (update_inputs) {
      this.inputLow.value = minValue;
      this.inputHigh.value = maxValue;
    }

    // Обеспечение корректного диапазона
    if (minValue > maxValue) {
      this.rangeMin.value = maxValue;
    }

    const percentMin = (minValue / this.rangeMin.max) * 100;
    const percentMax = (maxValue / this.rangeMax.max) * 100;

    this.rangeTrack.style.background = `linear-gradient(to right, ${this.options.colors.bgTrackTransparent} ${percentMin}%, ${this.options.colors.bgTrackFilled} ${percentMin}%, ${this.options.colors.bgTrackFilled} ${percentMax}%, ${this.options.colors.bgTrackTransparent} ${percentMax}%)`;
  }
}


window.addEventListener('load', () => {
  document.querySelectorAll('[data-range-name]').forEach(el => {
    new RangeSlider(el);
  });
});
