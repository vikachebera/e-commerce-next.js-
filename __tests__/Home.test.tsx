import {screen} from "@testing-library/dom";
import {render} from "@testing-library/react";
import Home from "@/app/page";

it('should have Examples text', () => {
    render(<Home/>)
    const myElem = screen.getByText('Examples')
    expect(myElem).toBeInTheDocument();
})