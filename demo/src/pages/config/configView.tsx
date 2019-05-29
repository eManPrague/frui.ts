import * as React from "react";
import FormField from "../../controls/formField";
import { TextBox } from "../../controls/textBox";
import ConfigViewModel from "./configViewModel";

const ConfigView: React.FunctionComponent<{ vm: ConfigViewModel }> = ({ vm }) => (
    <div className="form-row mt-2">
        <div className="col">
            <FormField label="Redmine url" target={vm.configuration} property="url" component={TextBox} controlId="apiurl" />
        </div>
        <div className="col">
            <FormField label="Redmine access token" target={vm.configuration} property="accessToken" component={TextBox} controlId="apitoken" />
        </div>
    </div>
);

export default ConfigView;
