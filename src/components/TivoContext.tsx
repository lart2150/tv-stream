import { createContext, ReactNode, useEffect, useState } from "react";
import { z } from "zod";

type Props = {
    children ?: ReactNode;
};

export type TivoContextType = {
    apiBaseUrl : string;
    domain : string;
    clientID : string;
    audience : string;
}

export const tivoContext = createContext<TivoContextType|null>(null);

const fetchValidator = z.object({
    apiBaseUrl: z.string(),
    domain: z.string(),
    clientID: z.string(),
    audience: z.string(),
});


export const TivoContextComponent = ({children} : Props) => {
    const [ctx, setCtx] = useState<TivoContextType|null>(null);
    useEffect(() => {
        fetch('config.json').then(rsp => {
                rsp.json().then( data => {
                    console.log('data', data);
                    const validatedData = fetchValidator.parse(data)
                    setCtx({
                        apiBaseUrl : validatedData.apiBaseUrl,
                        domain : validatedData.domain,
                        clientID : validatedData.clientID,
                        audience : validatedData.audience,
                    })
                }
            )
        })
    }, [])
  
    return (
      <tivoContext.Provider value={ctx}>
        {children}
      </tivoContext.Provider>
    );
  }