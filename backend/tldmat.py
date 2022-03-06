import numpy as np

#create dummies from TLD column
tldmat = pd.get_dummies(data.tld)

##label new dummies matrix
tldmat['tag'] = data['tag']

### subset malicious and benign sampls
tldmal = tldmat[tldmat['tag'] == 'malware']
tldben = tldmat[tldmat['tag'] == 'benign']

dd = []
for i in tldmat.columns[:-1]:
    md = np.mean(tldmal[i]) - np.mean(tldben[i])
    y = ttest_ind(tldmal[i], tldben[i])
    d2 = [i, md, y[1]]
    dd.append(d2)
    
dd = pd.DataFrame(dd)
dd.columns = ['Feature', 'Mean_Difference', 'P_Value']
dd = dd.sort_values(['Mean_Difference', 'P_Value'], ascending=[False, True])