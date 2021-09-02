import {Component} from "@angular/core";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Compbaser} from "ng-mslib";
import {YellowPepperService} from "../../services/yellowpepper.service";
import {RedPepperService} from "../../services/redpepper.service";
import {timeout} from "../../decorators/timeout-decorator";
import * as _ from "lodash";
import {CampaignTimelineChanelsModel} from "../../store/imsdb.interfaces_auto";
import {Lib} from "../../Lib";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'channel-props',
    host: {
        '(input-blur)': 'onFormChange($event)'
    },
    template: `
        <div style="padding-right: 5px">
            <form novalidate autocomplete="off" [formGroup]="m_contGroup">
                <div class="row">
                    <div class="inner userGeneral">
                        <div class="panel panel-default tallPanel">
                            <div class="panel-heading">
                                <small class="release">channel properties
                                    <i style="font-size: 1.4em" class="fa fa-cog pull-right"></i>
                                </small>
                                <small class="debug">{{me}}</small>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item">
                                    Name:
                                    <!--Channel name: {{(m_channel$ | async)?.getChanelName()}}-->
                                    <input class="pull-right" [formControl]="m_contGroup.controls['chanel_name']"/>
                                    <hr/>
                                </li>
                                <li class="list-group-item">
                                    Channel Color:
                                    <!--<input class="pull-right" [formControl]="m_contGroup.controls['chanel_color']"/>-->
                                    <!--<input #borderColor [disabled]="!borderSelection.checked" (colorPickerChange)="m_channelColorChanged.next($event)"-->
                                    <input class="pull-right" #borderColor (colorPickerChange)="m_channelColorChanged.next($event)"
                                           [cpOKButton]="true" [cpOKButtonClass]="'btn btn-primary btn-xs'"
                                           [cpFallbackColor]="'#123'"
                                           [cpPresetColors]="[]"
                                           [(colorPicker)]="m_color" [cpPosition]="'bottom'"
                                           [cpAlphaChannel]="'disabled'" style="width: 185px"
                                           [style.background]="m_color" [value]="m_color"/>

                                    <hr/>
                                </li>

                                <li class="list-group-item">
                                    <span i18n>repeat to fit</span>
                                    <div class="material-switch pull-right">
                                        <input (change)="onFormChange(w1.checked)"
                                               [formControl]="m_contGroup.controls['repeat_to_fit']"
                                               id="w1" #w1
                                               name="w1" type="checkbox"/>
                                        <label for="w1" class="label-primary"></label>
                                    </div>
                                </li>
                                <li class="list-group-item">
                                    <span i18n> random order</span>
                                    <div class="material-switch pull-right">
                                        <input (change)="onFormChange(w2.checked)"
                                               [formControl]="m_contGroup.controls['random_order']"
                                               id="w2" #w2
                                               name="w2" type="checkbox"/>
                                        <label for="w2" class="label-primary"></label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `,
    styles: [`
        input.ng-invalid {
            border-right: 10px solid red;
        }

        .material-switch {
            position: relative;
            padding-top: 10px;
        }

        .input-group {
            padding-top: 10px;
        }

        i {
            width: 20px;
        }
    `]
})
export class ChannelProps extends Compbaser {

    private channelModel: CampaignTimelineChanelsModel;
    private formInputs = {};
    // m_channel$: Observable<CampaignTimelineChanelsModel>;
    m_contGroup: FormGroup;
    m_color;
    m_channelColorChanged = new Subject();

    constructor(private fb: FormBuilder, private yp: YellowPepperService, private rp: RedPepperService) {
        super();
        this.m_contGroup = fb.group({
            'repeat_to_fit': [0],
            'chanel_name': [''],
            'chanel_color': ['#000'],
            'random_order': [0]
        });
        _.forEach(this.m_contGroup.controls, (value, key: string) => {
            this.formInputs[key] = this.m_contGroup.controls[key] as FormControl;
        })
        this.cancelOnDestroy(
            this.yp.listenChannelSelected()
                .subscribe((channel: CampaignTimelineChanelsModel) => {
                    this.channelModel = channel;
                    this.renderFormInputs();
                }, (e) => {
                    console.error(e)
                })
        );
        this.cancelOnDestroy(
            //
            this.m_channelColorChanged
                .debounceTime(1000)
                .filter(v => v != '#123')
                .subscribe((i_color: any) => {
                    this.updateSore()
                }, (e) => console.error(e))
        )

    }

    onFormChange(event) {
        this.updateSore();
    }

    @timeout()
    private updateSore() {
        // console.log(this.m_contGroup.status + ' ' + JSON.stringify(this.ngmslibService.cleanCharForXml(this.m_contGroup.value)));
        this.rp.setCampaignTimelineChannelRecord(this.channelModel.getCampaignTimelineChanelId(), 'random_order', this.m_contGroup.value.random_order);
        this.rp.setCampaignTimelineChannelRecord(this.channelModel.getCampaignTimelineChanelId(), 'repeat_to_fit', this.m_contGroup.value.repeat_to_fit);
        this.rp.setCampaignTimelineChannelRecord(this.channelModel.getCampaignTimelineChanelId(), 'chanel_name', this.m_contGroup.value.chanel_name);
        this.rp.setCampaignTimelineChannelRecord(this.channelModel.getCampaignTimelineChanelId(), 'chanel_color', Lib.ColorToDecimal(this.m_color));
        this.rp.reduxCommit()
    }

    private renderFormInputs() {
        if (!this.channelModel)
            return;
        _.forEach(this.formInputs, (value, key: string) => {
            let data = this.channelModel.getKey(key);
            data = StringJS(data).booleanToNumber();
            if (key == 'chanel_color')
                this.m_color = '#' + Lib.DecimalToHex(data);
            this.formInputs[key].setValue(data)
        });
    };

    destroy() {
    }
}
