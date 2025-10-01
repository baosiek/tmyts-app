import { AfterViewInit, Component, ElementRef, input, model, OnInit, ViewChild } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../../../material-imports';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IWidgetConfig } from '../../../../interfaces/widget-config-interface';

@Component({
  selector: 'app-color-setting',
  imports: [
    ...MATERIAL_IMPORTS,
    ReactiveFormsModule
  ],
  templateUrl: './color-setting.html',
  styleUrl: './color-setting.scss'
})
export class ColorSetting implements OnInit {

  configWidget = model.required<IWidgetConfig>()

  // Use ViewChild to get a reference to the element with the #colorTarget template variable
  @ViewChild('colorTarget', { static: false }) colorTarget!: ElementRef;

   // Use FormGroup for reactive form handling
  colorForm!: FormGroup;

  // Create a FormControl for your color picker
  backgroundColorCtr: FormControl = new FormControl('red');
  colorCtr: FormControl = new FormControl('black');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.colorForm = this.fb.group({
      // Initialize the color with a default value
      colorCtr: this.colorCtr,
      backgroundColorCtr: this.backgroundColorCtr
    });
  }

  // Handle color change
  onColorChange(event: any): void {
    console.log('New color selected:', event);
  }

  changeColor(){
    console.log("change color ", this.colorCtr.value)
    this.configWidget.update(
      currentConfig => (
        {
          ...currentConfig,
          color: this.colorCtr.value,
        }
      )
    ); 
    console.log("changed color ", this.configWidget())   
  }

  changeBackgroundColor(){
    console.log("change background color ", this.backgroundColorCtr.value)
    this.configWidget.update(
      currentConfig => (
        {
          ...currentConfig,
          backgroundColor: this.backgroundColorCtr.value,
        }
      )
    ); 
     console.log("changed background color ", this.configWidget())   
  }
}
