import {render} from "@testing-library/react";
import Home from "@/app/page";

test('Home page renders without errors', () => {
    render(<Home />);
});